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

    // Check if tables exist
    try {
      await query(`SELECT 1 FROM bill_payment_requests LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ 
        error: 'Bills payment system is being set up. Please try again in a few minutes.',
        code: 'TABLE_NOT_READY'
      }, { status: 503 })
    }

    const { billId, accountId, amount } = await req.json()

    // Check account balance
    const accountRes = await query(
      `SELECT balance FROM accounts WHERE id = $1 AND "userId" = $2`,
      [accountId, payload.userId]
    )

    if (accountRes.rows.length === 0) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    if (accountRes.rows[0].balance < amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }

    const reference = `BILL${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Create payment request for admin approval
    const requestId = `billpay_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
    
    await query(
      `INSERT INTO bill_payment_requests (
        id, user_id, bill_id, account_id, amount, reference, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [requestId, payload.userId, billId, accountId, amount, reference, 'PENDING']
    )

    // Create notification
    try {
      await query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, data, action_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          payload.userId,
          'bill',
          'Bill Payment Pending Approval',
          `Your bill payment of $${amount} is pending admin approval.`,
          JSON.stringify({ billId, amount, reference }),
          '/dashboard/bills'
        ]
      )
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment request submitted for approval',
      reference 
    })
  } catch (error) {
    console.error('Error processing bill payment:', error)
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
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

    // Check if table exists
    try {
      await query(`SELECT 1 FROM bill_payment_requests LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ requests: [] })
    }

    const result = await query(
      `SELECT 
        bpr.id, 
        bpr.amount, 
        bpr.status, 
        bpr.reference, 
        bpr.created_at as "createdAt",
        b.bill_name as "billName", 
        b.due_date as "dueDate"
       FROM bill_payment_requests bpr
       LEFT JOIN bills b ON bpr.bill_id = b.id
       WHERE bpr.user_id = $1
       ORDER BY bpr.created_at DESC`,
      [payload.userId]
    )

    return NextResponse.json({ requests: result.rows || [] })
  } catch (error) {
    console.error('Error fetching payment requests:', error)
    return NextResponse.json({ requests: [] })
  }
}
