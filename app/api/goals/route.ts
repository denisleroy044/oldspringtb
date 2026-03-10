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

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    // Check if table exists
    try {
      await query(`SELECT 1 FROM goals LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ goals: [] })
    }

    let queryText = `
      SELECT 
        g.id,
        g.category,
        g.name,
        g.description,
        g.target_amount as "targetAmount",
        g.current_amount as "currentAmount",
        g.start_date as "startDate",
        g.target_date as "targetDate",
        g.priority,
        g.status,
        g.progress,
        g.auto_save as "autoSave",
        g.auto_save_amount as "autoSaveAmount",
        g.auto_save_frequency as "autoSaveFrequency",
        g.icon,
        g.color,
        g.created_at as "createdAt",
        g.completed_at as "completedAt",
        a."accountName",
        a."accountNumber"
      FROM goals g
      LEFT JOIN accounts a ON g.account_id = a.id
      WHERE g.user_id = $1
    `

    const params: any[] = [payload.userId]
    let paramIndex = 2

    if (status && status !== 'all') {
      queryText += ` AND g.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (category && category !== 'all') {
      queryText += ` AND g.category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    queryText += ` ORDER BY 
      CASE g.status 
        WHEN 'active' THEN 1
        WHEN 'paused' THEN 2
        WHEN 'completed' THEN 3
        ELSE 4
      END,
      g.target_date ASC`

    const result = await query(queryText, params)

    // Get milestones for each goal
    const goalsWithMilestones = await Promise.all(
      result.rows.map(async (goal) => {
        const milestonesRes = await query(
          `SELECT 
            id,
            name,
            description,
            target_amount as "targetAmount",
            current_amount as "currentAmount",
            target_date as "targetDate",
            completed,
            completed_at as "completedAt"
           FROM goal_milestones
           WHERE goal_id = $1
           ORDER BY target_amount ASC`,
          [goal.id]
        )

        const contributionsRes = await query(
          `SELECT 
            id,
            amount,
            contributed_at as "contributedAt",
            notes
           FROM goal_contributions
           WHERE goal_id = $1
           ORDER BY contributed_at DESC
           LIMIT 5`,
          [goal.id]
        )

        return {
          ...goal,
          milestones: milestonesRes.rows,
          recentContributions: contributionsRes.rows
        }
      })
    )

    return NextResponse.json({ goals: goalsWithMilestones })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ goals: [] })
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

    const data = await req.json()

    const goalId = `goal_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

    await query(
      `INSERT INTO goals (
        id, user_id, account_id, category, name, description,
        target_amount, current_amount, start_date, target_date,
        priority, status, progress, auto_save, auto_save_amount,
        auto_save_frequency, auto_save_account_id, icon, color, notes,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW())`,
      [
        goalId,
        payload.userId,
        data.accountId || null,
        data.category || 'savings',
        data.name,
        data.description || null,
        data.targetAmount,
        data.currentAmount || 0,
        data.startDate,
        data.targetDate,
        data.priority || 'medium',
        data.status || 'active',
        0,
        data.autoSave || false,
        data.autoSaveAmount || null,
        data.autoSaveFrequency || null,
        data.autoSaveAccountId || null,
        data.icon || 'Target',
        data.color || '#3b82f6',
        data.notes || null
      ]
    )

    // Add milestones if provided
    if (data.milestones && data.milestones.length > 0) {
      for (const milestone of data.milestones) {
        await query(
          `INSERT INTO goal_milestones (
            id, goal_id, name, description, target_amount, target_date
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            `milestone_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            goalId,
            milestone.name,
            milestone.description || null,
            milestone.targetAmount,
            milestone.targetDate || null
          ]
        )
      }
    }

    // Create notification
    try {
      await query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, data, action_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          payload.userId,
          'goal',
          'New Goal Created',
          `Goal "${data.name}" has been created with target of $${data.targetAmount}.`,
          JSON.stringify({ goalId, name: data.name, targetAmount: data.targetAmount }),
          '/dashboard/goals'
        ]
      )
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json({ success: true, id: goalId })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id, ...updates } = await req.json()

    // Calculate progress if current_amount is updated
    if (updates.currentAmount) {
      const goalRes = await query(
        `SELECT target_amount FROM goals WHERE id = $1 AND user_id = $2`,
        [id, payload.userId]
      )
      if (goalRes.rows.length > 0) {
        const targetAmount = goalRes.rows[0].target_amount
        updates.progress = (updates.currentAmount / targetAmount) * 100
      }
    }

    const setClauses = []
    const values = [id, payload.userId]
    let paramIndex = 3

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const column = key === 'targetAmount' ? 'target_amount' :
                      key === 'currentAmount' ? 'current_amount' :
                      key === 'startDate' ? 'start_date' :
                      key === 'targetDate' ? 'target_date' :
                      key === 'autoSave' ? 'auto_save' :
                      key === 'autoSaveAmount' ? 'auto_save_amount' :
                      key === 'autoSaveFrequency' ? 'auto_save_frequency' :
                      key === 'autoSaveAccountId' ? 'auto_save_account_id' :
                      key
        setClauses.push(`"${column}" = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    setClauses.push('updated_at = NOW()')

    await query(
      `UPDATE goals 
       SET ${setClauses.join(', ')}
       WHERE id = $1 AND user_id = $2`,
      values
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Goal ID required' }, { status: 400 })
    }

    await query(
      `DELETE FROM goals WHERE id = $1 AND user_id = $2`,
      [id, payload.userId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}
