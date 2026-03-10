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

    // Check if table exists
    try {
      await query(`SELECT 1 FROM savings LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ savings: [] })
    }

    let queryText = `
      SELECT 
        s.id,
        s.name,
        s.description,
        s.target_amount as "targetAmount",
        s.current_amount as "currentAmount",
        s.start_date as "startDate",
        s.target_date as "targetDate",
        s.priority,
        s.status,
        s.progress,
        s.auto_save as "autoSave",
        s.auto_save_amount as "autoSaveAmount",
        s.auto_save_frequency as "autoSaveFrequency",
        s.auto_save_day as "autoSaveDay",
        s.icon,
        s.color,
        s.created_at as "createdAt",
        s.completed_at as "completedAt",
        a."accountType" as "accountName",
        a."accountNumber"
      FROM savings s
      LEFT JOIN accounts a ON s.account_id = a.id
      WHERE s.user_id = $1
    `

    const params: any[] = [payload.userId]
    let paramIndex = 2

    if (status && status !== 'all') {
      queryText += ` AND s.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    queryText += ` ORDER BY 
      CASE s.status 
        WHEN 'active' THEN 1
        WHEN 'paused' THEN 2
        WHEN 'completed' THEN 3
        ELSE 4
      END,
      s.target_date ASC`

    const result = await query(queryText, params)

    // Get contributions for each savings goal
    const savingsWithContributions = await Promise.all(
      result.rows.map(async (saving) => {
        try {
          const contributionsRes = await query(
            `SELECT 
              id,
              amount,
              contributed_at as "contributedAt",
              notes
             FROM savings_contributions
             WHERE savings_id = $1
             ORDER BY contributed_at DESC
             LIMIT 10`,
            [saving.id]
          )
          return {
            ...saving,
            contributions: contributionsRes.rows || []
          }
        } catch (error) {
          return {
            ...saving,
            contributions: []
          }
        }
      })
    )

    return NextResponse.json({ savings: savingsWithContributions })
  } catch (error) {
    console.error('Error fetching savings:', error)
    return NextResponse.json({ savings: [] })
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

    // Validate required fields
    if (!data.name || !data.targetAmount || !data.targetDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if table exists, if not return helpful message
    try {
      await query(`SELECT 1 FROM savings LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ 
        error: 'Savings system is being set up. Please try again in a few minutes.',
        code: 'TABLE_NOT_READY'
      }, { status: 503 })
    }

    const savingId = `saving_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

    await query(
      `INSERT INTO savings (
        id, user_id, account_id, name, description,
        target_amount, current_amount, start_date, target_date,
        priority, status, progress, auto_save, auto_save_amount,
        auto_save_frequency, auto_save_day, icon, color, notes,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())`,
      [
        savingId,
        payload.userId,
        data.accountId || null,
        data.name,
        data.description || null,
        data.targetAmount,
        data.currentAmount || 0,
        data.startDate || new Date().toISOString().split('T')[0],
        data.targetDate,
        data.priority || 'medium',
        data.status || 'active',
        0,
        data.autoSave || false,
        data.autoSaveAmount || null,
        data.autoSaveFrequency || null,
        data.autoSaveDay || null,
        data.icon || 'PiggyBank',
        data.color || '#10b981',
        data.notes || null
      ]
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
          'saving',
          'New Savings Goal Created',
          `Savings goal "${data.name}" has been created with target of $${data.targetAmount}.`,
          JSON.stringify({ savingId, name: data.name, targetAmount: data.targetAmount }),
          '/dashboard/savings'
        ]
      )
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json({ success: true, id: savingId })
  } catch (error) {
    console.error('Error creating savings goal:', error)
    return NextResponse.json({ error: 'Failed to create savings goal' }, { status: 500 })
  }
}
