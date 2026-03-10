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
      fromAccountId,
      toAccountId,
      fromCurrency,
      toCurrency,
      fromAmount,
      exchangeRate
    } = await req.json()

    // Validate amount
    const amount = parseFloat(fromAmount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Get from account balance
    const fromAccountRes = await query(
      `SELECT balance, currency FROM accounts WHERE id = $1 AND "userId" = $2`,
      [fromAccountId, payload.userId]
    )

    if (fromAccountRes.rows.length === 0) {
      return NextResponse.json({ error: 'Source account not found' }, { status: 404 })
    }

    const fromBalance = parseFloat(fromAccountRes.rows[0].balance)
    if (fromBalance < amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }

    // Calculate to amount
    const toAmount = amount * exchangeRate
    const fee = amount * 0.001 // 0.1% fee
    const reference = `SWP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Start transaction
    await query('BEGIN')

    try {
      // Deduct from source account
      await query(
        `UPDATE accounts SET balance = balance - $1, "updatedAt" = NOW() WHERE id = $2`,
        [amount + fee, fromAccountId]
      )

      // Check if destination account exists
      let toAccountExists = toAccountId
      
      if (!toAccountExists) {
        // Create new currency account
        const newAccountRes = await query(
          `INSERT INTO accounts (
            id, "userId", "accountType", balance, currency, "accountNumber", status, "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          RETURNING id`,
          [
            `acc_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
            payload.userId,
            'CURRENCY',
            toAmount,
            toCurrency,
            `SWP${Math.floor(Math.random() * 1000000)}`,
            'ACTIVE'
          ]
        )
        toAccountExists = newAccountRes.rows[0].id
      } else {
        // Add to destination account
        await query(
          `UPDATE accounts SET balance = balance + $1, "updatedAt" = NOW() WHERE id = $2`,
          [toAmount, toAccountId]
        )
      }

      // Record swap request
      const swapId = `swap_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
      await query(
        `INSERT INTO swap_requests (
          id, user_id, from_account_id, to_account_id, from_currency, to_currency,
          from_amount, to_amount, exchange_rate, fee, reference, status, completed_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW(), NOW())`,
        [
          swapId,
          payload.userId,
          fromAccountId,
          toAccountExists,
          fromCurrency,
          toCurrency,
          amount,
          toAmount,
          exchangeRate,
          fee,
          reference,
          'COMPLETED'
        ]
      )

      await query('COMMIT')

      // Create notification
      try {
        await query(
          `INSERT INTO notifications (
            id, user_id, type, title, message, data, action_url, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [
            `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
            payload.userId,
            'swap',
            'Currency Swap Completed',
            `Successfully swapped ${amount} ${fromCurrency} to ${toAmount.toFixed(2)} ${toCurrency}`,
            JSON.stringify({
              swapId,
              fromAmount: amount,
              fromCurrency,
              toAmount,
              toCurrency,
              rate: exchangeRate,
              fee,
              reference
            }),
            '/dashboard/swap/history'
          ]
        )
      } catch (notifError) {
        console.error('Failed to create notification:', notifError)
      }

      return NextResponse.json({
        success: true,
        swap: {
          id: swapId,
          fromAmount: amount,
          fromCurrency,
          toAmount,
          toCurrency,
          rate: exchangeRate,
          fee,
          reference,
          status: 'COMPLETED'
        }
      })

    } catch (txError) {
      await query('ROLLBACK')
      throw txError
    }

  } catch (error: any) {
    console.error('Error processing swap:', error)
    return NextResponse.json({
      error: error.message || 'Failed to process swap'
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

    const result = await query(
      `SELECT 
        id,
        from_currency as "fromCurrency",
        to_currency as "toCurrency",
        from_amount as "fromAmount",
        to_amount as "toAmount",
        exchange_rate as "rate",
        fee,
        reference,
        status,
        completed_at as "completedAt",
        created_at as "createdAt"
       FROM swap_requests
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [payload.userId]
    )

    return NextResponse.json({ swaps: result.rows || [] })
  } catch (error) {
    console.error('Error fetching swaps:', error)
    return NextResponse.json({ swaps: [] }, { status: 500 })
  }
}
