import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'
import { requestOTP } from '@/lib/otp/otpService'

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
      fromAccountId, 
      toAccountId, 
      toAccountNumber, 
      toBankName, 
      toAccountName, 
      amount, 
      description,
      type = 'internal'
    } = await req.json()

    // Validate amount
    const transferAmount = parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Check if from account exists and belongs to user
    const fromAccountRes = await query(
      `SELECT id, balance, "accountType", "accountNumber" FROM accounts 
       WHERE id = $1 AND "userId" = $2 AND status = 'ACTIVE'`,
      [fromAccountId, payload.userId]
    )

    if (fromAccountRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid source account' }, { status: 400 })
    }

    const fromAccount = fromAccountRes.rows[0]
    const fromBalance = parseFloat(fromAccount.balance)

    // Check sufficient funds
    if (fromBalance < transferAmount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }

    // Calculate fee (0 for internal, $15 for external/wire)
    let fee = 0
    if (type === 'external') {
      fee = 15.00
    } else if (type === 'wire') {
      fee = 25.00
    }

    const totalDeduction = transferAmount + fee

    // Generate OTP for verification
    const otpResult = await requestOTP(
      payload.email, 
      'TRANSFER', 
      `${payload.firstName} ${payload.lastName}`
    )

    // Store transfer data in session/temp storage with OTP request ID
    // We'll use a simple in-memory store for now (in production, use Redis)
    const transferData = {
      userId: payload.userId,
      fromAccountId,
      toAccountId,
      toAccountNumber,
      toBankName,
      toAccountName,
      amount: transferAmount,
      description,
      type,
      fee,
      totalDeduction,
      fromBalance,
      newBalance: fromBalance - totalDeduction,
      status: 'PENDING_OTP',
      createdAt: new Date().toISOString()
    }

    // Store in global map (you'll need to create this)
    if (!global.transferStore) global.transferStore = new Map()
    global.transferStore.set(otpResult.requestId, transferData)

    return NextResponse.json({
      success: true,
      requiresOTP: true,
      requestId: otpResult.requestId,
      message: 'OTP sent to your email. Please verify to complete transfer.',
      details: {
        amount: transferAmount,
        fee,
        total: totalDeduction,
        fromAccount: fromAccount.accountNumber.slice(-4)
      }
    })

  } catch (error) {
    console.error('Transfer API error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate transfer' },
      { status: 500 }
    )
  }
}
