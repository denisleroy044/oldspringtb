import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'
import { verifyOTP } from '@/lib/otp/otpService'
import { generateTransferReference } from '@/lib/utils/reference'

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

    const { requestId, otpCode } = await req.json()

    // Verify OTP
    const isValid = await verifyOTP(requestId, otpCode)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // Get transfer data from store
    if (!global.transferStore || !global.transferStore.has(requestId)) {
      return NextResponse.json({ error: 'Transfer session expired' }, { status: 400 })
    }

    const transferData = global.transferStore.get(requestId)
    
    // Verify user owns this transfer
    if (transferData.userId !== payload.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Start a database transaction
    const client = await (await import('@/lib/db')).pool.connect()
    
    try {
      await client.query('BEGIN')

      // Check current balance again (in case it changed)
      const balanceCheck = await client.query(
        `SELECT balance FROM accounts WHERE id = $1 FOR UPDATE`,
        [transferData.fromAccountId]
      )
      
      const currentBalance = parseFloat(balanceCheck.rows[0].balance)
      if (currentBalance < transferData.totalDeduction) {
        throw new Error('Insufficient funds')
      }

      // Generate unique reference
      const reference = generateTransferReference()

      // Update from account balance
      await client.query(
        `UPDATE accounts 
         SET balance = balance - $1, "updatedAt" = NOW() 
         WHERE id = $2`,
        [transferData.totalDeduction, transferData.fromAccountId]
      )

      // For internal transfers, update to account balance
      if (transferData.toAccountId) {
        await client.query(
          `UPDATE accounts 
           SET balance = balance + $1, "updatedAt" = NOW() 
           WHERE id = $2`,
          [transferData.amount, transferData.toAccountId]
        )
      }

      // Create transfer record
      const transferRes = await client.query(
        `INSERT INTO transfers (
          id, "userId", "fromAccountId", "toAccountId", 
          "toAccountNumber", "toBankName", "toAccountName",
          amount, description, reference, status, type, fee, 
          "completedAt", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW(), NOW())
        RETURNING id, reference`,
        [
          require('crypto').randomUUID(),
          transferData.userId,
          transferData.fromAccountId,
          transferData.toAccountId || null,
          transferData.toAccountNumber || null,
          transferData.toBankName || null,
          transferData.toAccountName || null,
          transferData.amount,
          transferData.description || 'Transfer',
          reference,
          'COMPLETED',
          transferData.type || 'TRANSFER',
          transferData.fee || 0
        ]
      )

      // Create transaction records
      // Debit transaction for sender
      await client.query(
        `INSERT INTO transactions (
          id, "userId", "senderAccountId", type, amount, description, 
          reference, status, "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          require('crypto').randomUUID(),
          transferData.userId,
          transferData.fromAccountId,
          'TRANSFER',
          transferData.amount,
          transferData.description || 'Transfer',
          reference,
          'COMPLETED'
        ]
      )

      // Credit transaction for receiver (if internal)
      if (transferData.toAccountId) {
        await client.query(
          `INSERT INTO transactions (
            id, "userId", "receiverAccountId", type, amount, description, 
            reference, status, "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          [
            require('crypto').randomUUID(),
            transferData.userId,
            transferData.toAccountId,
            'TRANSFER',
            transferData.amount,
            transferData.description || 'Transfer',
            reference,
            'COMPLETED'
          ]
        )
      }

      await client.query('COMMIT')

      // Clean up store
      global.transferStore.delete(requestId)

      // Get updated account balances
      const updatedFromRes = await client.query(
        `SELECT balance FROM accounts WHERE id = $1`,
        [transferData.fromAccountId]
      )
      
      let updatedToRes = null
      if (transferData.toAccountId) {
        updatedToRes = await client.query(
          `SELECT balance FROM accounts WHERE id = $1`,
          [transferData.toAccountId]
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Transfer completed successfully',
        transfer: {
          id: transferRes.rows[0].id,
          reference: transferRes.rows[0].reference,
          amount: transferData.amount,
          fee: transferData.fee,
          total: transferData.totalDeduction,
          fromAccount: transferData.fromAccountId,
          toAccount: transferData.toAccountId || transferData.toAccountNumber,
          description: transferData.description,
          timestamp: new Date().toISOString(),
          newBalance: {
            from: parseFloat(updatedFromRes.rows[0].balance),
            to: updatedToRes ? parseFloat(updatedToRes.rows[0].balance) : null
          }
        }
      })

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Transfer verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to complete transfer' },
      { status: 500 }
    )
  }
}
