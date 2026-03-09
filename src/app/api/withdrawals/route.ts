import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const {
      accountId,
      amount,
      method,
      recipientName,
      recipientAccount,
      recipientBank,
      recipientRouting,
      recipientAddress,
      saveMethod
    } = await req.json()

    // Validate amount
    const withdrawAmount = parseFloat(amount)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Get account balance
    const accountRes = await query(
      `SELECT balance FROM accounts WHERE id = $1 AND "userId" = $2`,
      [accountId, payload.userId]
    )

    if (accountRes.rows.length === 0) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    const balance = parseFloat(accountRes.rows[0].balance)
    if (balance < withdrawAmount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }

    // Get method details for fee calculation
    const methodRes = await query(
      `SELECT fee_type, fee_value FROM withdrawal_methods WHERE method = $1 AND is_active = true`,
      [method]
    )

    let fee = 0
    if (methodRes.rows.length > 0) {
      const { fee_type, fee_value } = methodRes.rows[0]
      fee = fee_type === 'percentage' ? (withdrawAmount * fee_value / 100) : fee_value
    }

    // Generate reference
    const reference = `WD${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Create withdrawal request
    const withdrawalId = `wd_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
    
    const result = await query(
      `INSERT INTO withdrawals (
        id, user_id, account_id, amount, method, recipient_name, recipient_account,
        recipient_bank, recipient_routing, recipient_address, fee, reference, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING id, amount, method, fee, reference, status, created_at`,
      [
        withdrawalId,
        payload.userId,
        accountId,
        withdrawAmount,
        method,
        recipientName || null,
        recipientAccount || null,
        recipientBank || null,
        recipientRouting || null,
        recipientAddress || null,
        fee,
        reference,
        'PENDING'
      ]
    )

    // Save method if requested
    if (saveMethod && (recipientAccount || recipientAddress)) {
      await query(
        `INSERT INTO user_withdrawal_methods (
          id, user_id, method, account_holder, account_number, routing_number, bank_name, wallet_address, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        ON CONFLICT (user_id, method, account_number) DO NOTHING`,
        [
          `uwm_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          payload.userId,
          method,
          recipientName || null,
          recipientAccount || null,
          recipientRouting || null,
          recipientBank || null,
          recipientAddress || null
        ]
      )
    }

    // Create notification
    try {
      const methodDisplay = method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      await query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, data, action_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          payload.userId,
          'withdrawal',
          'Withdrawal Request Submitted',
          `Your withdrawal of $${withdrawAmount.toFixed(2)} via ${methodDisplay} has been submitted and is being processed.`,
          JSON.stringify({
            withdrawalId,
            amount: withdrawAmount,
            method,
            fee,
            reference,
            status: 'PENDING'
          }),
          '/dashboard/withdrawals'
        ]
      )
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json({ 
      success: true,
      withdrawal: result.rows[0],
      message: 'Withdrawal request submitted successfully'
    })
  } catch (error: any) {
    console.error('Error creating withdrawal:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create withdrawal request' 
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')

    let queryText = `
      SELECT 
        w.id, w.amount, w.method, w.fee, w.reference, w.status, w.created_at as "createdAt",
        w.processed_at as "processedAt", w.completed_at as "completedAt",
        a."accountNumber", a."accountType"
      FROM withdrawals w
      LEFT JOIN accounts a ON w.account_id = a.id
      WHERE w.user_id = $1
    `
    const params: any[] = [payload.userId]

    if (status) {
      params.push(status)
      queryText += ` AND w.status = $${params.length}`
    }

    queryText += ` ORDER BY w.created_at DESC LIMIT $${params.length + 1}`
    params.push(limit)

    const result = await query(queryText, params)

    return NextResponse.json({ withdrawals: result.rows || [] })
  } catch (error) {
    console.error('Error fetching withdrawals:', error)
    return NextResponse.json({ withdrawals: [] }, { status: 500 })
  }
}
