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
    const accountId = searchParams.get('accountId')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Check if statements table exists
    try {
      await query(`SELECT 1 FROM statements LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ statements: [] })
    }

    let queryText = `
      SELECT 
        s.id, 
        s.statement_number as "statementNumber",
        s.statement_type as "statementType",
        s.period_start as "periodStart",
        s.period_end as "periodEnd",
        s.account_name as "accountName",
        s.account_number_masked as "accountNumberMasked",
        s.opening_balance as "openingBalance",
        s.closing_balance as "closingBalance",
        s.total_deposits as "totalDeposits",
        s.total_withdrawals as "totalWithdrawals",
        s.transaction_count as "transactionCount",
        s.generated_at as "generatedAt"
       FROM statements s
       WHERE s.user_id = $1
    `

    const params: any[] = [payload.userId]
    let paramIndex = 2

    if (accountId && accountId !== 'all') {
      queryText += ` AND s.account_id = $${paramIndex}`
      params.push(accountId)
      paramIndex++
    }

    if (type && type !== 'all') {
      queryText += ` AND s.statement_type = $${paramIndex}`
      params.push(type.toUpperCase())
      paramIndex++
    }

    queryText += ` ORDER BY s.period_end DESC LIMIT $${paramIndex}`
    params.push(limit)

    const result = await query(queryText, params)

    return NextResponse.json({ statements: result.rows || [] })
  } catch (error) {
    console.error('Error fetching statements:', error)
    return NextResponse.json({ statements: [] })
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

    const { accountId, type = 'MONTHLY', year, month } = await req.json()

    // Validate inputs
    if (!accountId || !year || !month) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if statement already exists for this period
    const existingRes = await query(
      `SELECT id FROM statements 
       WHERE account_id = $1 
       AND EXTRACT(YEAR FROM period_start) = $2 
       AND EXTRACT(MONTH FROM period_start) = $3`,
      [accountId, year, month]
    )

    if (existingRes.rows.length > 0) {
      return NextResponse.json({ 
        error: 'Statement already exists for this period',
        statementId: existingRes.rows[0].id 
      }, { status: 409 })
    }

    // Try to generate statement
    try {
      const result = await query(
        `SELECT generate_monthly_statement($1, $2, $3, $4) as statement_id`,
        [payload.userId, accountId, year, month]
      )

      if (!result.rows[0] || !result.rows[0].statement_id) {
        throw new Error('Failed to generate statement')
      }

      const statementId = result.rows[0].statement_id

      // Get the generated statement
      const statementRes = await query(
        `SELECT 
          id, 
          statement_number as "statementNumber",
          period_start as "periodStart",
          period_end as "periodEnd",
          opening_balance as "openingBalance",
          closing_balance as "closingBalance"
         FROM statements
         WHERE id = $1`,
        [statementId]
      )

      // Create notification
      try {
        await query(
          `INSERT INTO notifications (
            id, user_id, type, title, message, data, action_url, is_read, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          [
            `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
            payload.userId,
            'statement',
            'Statement Generated',
            `Your ${type.toLowerCase()} statement for ${month}/${year} has been generated.`,
            JSON.stringify({ 
              statementId,
              period: `${month}/${year}`
            }),
            '/dashboard/statements',
            false
          ]
        )
      } catch (notifError) {
        console.error('Failed to create notification:', notifError)
      }

      return NextResponse.json({ 
        success: true, 
        statement: statementRes.rows[0] 
      })

    } catch (funcError: any) {
      console.error('Function error:', funcError)
      return NextResponse.json({ 
        error: 'Could not generate statement. Please ensure the account has transactions.',
        details: funcError.message
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error generating statement:', error)
    return NextResponse.json({ error: 'Failed to generate statement' }, { status: 500 })
  }
}
