import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

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

    // Check if user is admin
    const userRes = await query(
      'SELECT role FROM users WHERE id = $1',
      [payload.userId]
    )

    if (userRes.rows[0]?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all pending deposits with user info
    const depositsRes = await query(
      `SELECT 
        d.*,
        u.email,
        u."firstName",
        u."lastName",
        a."accountType" as "targetAccountType",
        a."accountNumber" as "targetAccountNumber"
       FROM deposits d
       JOIN users u ON d."userId" = u.id
       LEFT JOIN accounts a ON d."accountId" = a.id
       WHERE d.status = 'PENDING'
       ORDER BY d."createdAt" ASC`
    )

    // Also get approved/rejected history
    const historyRes = await query(
      `SELECT 
        d.*,
        u.email,
        u."firstName",
        u."lastName"
       FROM deposits d
       JOIN users u ON d."userId" = u.id
       WHERE d.status IN ('APPROVED', 'REJECTED', 'COMPLETED')
       ORDER BY d."updatedAt" DESC
       LIMIT 50`
    )

    return NextResponse.json({
      pending: depositsRes.rows,
      history: historyRes.rows
    })

  } catch (error) {
    console.error('Admin deposits API error:', error)
    return NextResponse.json(
      { error: 'Failed to load deposits' },
      { status: 500 }
    )
  }
}

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

    // Check if user is admin
    const userRes = await query(
      'SELECT role FROM users WHERE id = $1',
      [payload.userId]
    )

    if (userRes.rows[0]?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { depositId, action, adminNotes, transactionId } = await req.json()

    // Get deposit details
    const depositRes = await query(
      `SELECT * FROM deposits WHERE id = $1`,
      [depositId]
    )

    if (depositRes.rows.length === 0) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    }

    const deposit = depositRes.rows[0]

    if (action === 'approve') {
      // Start transaction
      const client = await (await import('@/lib/db')).pool.connect()
      
      try {
        await client.query('BEGIN')

        // Update deposit status
        await client.query(
          `UPDATE deposits 
           SET status = 'APPROVED', "adminNotes" = $1, "approvedBy" = $2, "approvedAt" = NOW(), "updatedAt" = NOW()
           WHERE id = $3`,
          [adminNotes || 'Approved', payload.userId, depositId]
        )

        // If deposit has an accountId, update the balance
        if (deposit.accountId) {
          await client.query(
            `UPDATE accounts 
             SET balance = balance + $1, "updatedAt" = NOW()
             WHERE id = $2`,
            [deposit.amount, deposit.accountId]
          )

          // Create transaction record
          const crypto = require('crypto')
          await client.query(
            `INSERT INTO transactions (
              id, "userId", "receiverAccountId", type, amount, description, 
              reference, status, "createdAt", "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
            [
              crypto.randomUUID(),
              deposit.userId,
              deposit.accountId,
              'DEPOSIT',
              deposit.amount,
              `Deposit via ${deposit.method}`,
              deposit.transactionId || `DEP-${Date.now()}`,
              'COMPLETED'
            ]
          )
        }

        await client.query('COMMIT')
        
        return NextResponse.json({ 
          success: true, 
          message: 'Deposit approved and funds added'
        })

      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }

    } else if (action === 'reject') {
      // Update deposit status
      await query(
        `UPDATE deposits 
         SET status = 'REJECTED', "adminNotes" = $1, "updatedAt" = NOW()
         WHERE id = $2`,
        [adminNotes || 'Rejected', depositId]
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Deposit rejected'
      })

    } else if (action === 'complete') {
      // Mark as completed (for external verification)
      await query(
        `UPDATE deposits 
         SET status = 'COMPLETED', "transactionId" = $1, "completedAt" = NOW(), "updatedAt" = NOW()
         WHERE id = $2`,
        [transactionId || deposit.transactionId, depositId]
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Deposit marked as completed'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Admin deposit action error:', error)
    return NextResponse.json(
      { error: 'Failed to process deposit' },
      { status: 500 }
    )
  }
}
