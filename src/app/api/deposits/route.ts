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

    const { amount, method, accountId, cryptoCurrency, senderInfo } = await req.json()

    // Validate amount
    const depositAmount = parseFloat(amount)
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Create deposit request
    const depositId = `dep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    
    const result = await query(
      `INSERT INTO deposits (
        id, "userId", "accountId", amount, method, "cryptoCurrency", 
        "senderInfo", status, "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, amount, method, status, "createdAt"`,
      [
        depositId,
        payload.userId,
        accountId || null,
        depositAmount,
        method,
        cryptoCurrency || null,
        senderInfo || null,
        'PENDING'
      ]
    )

    // Create notification for the deposit request using correct schema
    try {
      const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
      const methodDisplay = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
      
      await query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, data, action_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          notificationId,
          payload.userId,
          'deposit',
          'Deposit Request Submitted',
          `Your ${methodDisplay} deposit of $${depositAmount.toFixed(2)} has been submitted and is pending approval.`,
          JSON.stringify({
            amount: depositAmount,
            method: method,
            depositId: depositId,
            status: 'PENDING'
          }),
          '/dashboard/deposit/requests'
        ]
      )
      console.log('✅ Deposit notification created')
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json({ 
      success: true,
      deposit: result.rows[0],
      message: 'Deposit request submitted successfully'
    })
  } catch (error: any) {
    console.error('Error creating deposit:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create deposit request' 
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

    // Get user's deposit requests
    const result = await query(
      `SELECT 
        id, amount, method, status, "transactionId" as reference, "createdAt"
       FROM deposits
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 50`,
      [payload.userId]
    )

    return NextResponse.json({ deposits: result.rows || [] })
  } catch (error) {
    console.error('Error fetching deposits:', error)
    return NextResponse.json({ deposits: [] }, { status: 500 })
  }
}
