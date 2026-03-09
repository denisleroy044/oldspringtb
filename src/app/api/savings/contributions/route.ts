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

    const { savingsId, amount, fromAccountId, notes } = await req.json()

    // Check if savings goal exists and belongs to user
    const savingsRes = await query(
      `SELECT id, current_amount, target_amount FROM savings WHERE id = $1 AND user_id = $2`,
      [savingsId, payload.userId]
    )

    if (savingsRes.rows.length === 0) {
      return NextResponse.json({ error: 'Savings goal not found' }, { status: 404 })
    }

    const savings = savingsRes.rows[0]
    const newCurrentAmount = parseFloat(savings.current_amount) + parseFloat(amount)
    const progress = (newCurrentAmount / parseFloat(savings.target_amount)) * 100

    // Insert contribution
    await query(
      `INSERT INTO savings_contributions (
        id, savings_id, amount, from_account_id, notes, contributed_at, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [
        `contrib_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        savingsId,
        amount,
        fromAccountId || null,
        notes || null
      ]
    )

    // Update savings goal
    await query(
      `UPDATE savings 
       SET current_amount = current_amount + $1, progress = $2, updated_at = NOW()
       WHERE id = $3`,
      [amount, progress, savingsId]
    )

    // Check if goal is completed
    if (newCurrentAmount >= parseFloat(savings.target_amount)) {
      await query(
        `UPDATE savings 
         SET status = 'completed', completed_at = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [savingsId]
      )

      // Create completion notification
      await query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, data, action_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          payload.userId,
          'saving',
          'Savings Goal Achieved! 🎉',
          `Congratulations! You've reached your savings goal!`,
          JSON.stringify({ savingsId }),
          '/dashboard/savings'
        ]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding contribution:', error)
    return NextResponse.json({ error: 'Failed to add contribution' }, { status: 500 })
  }
}
