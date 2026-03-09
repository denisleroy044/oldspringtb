import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const statementId = params.id

    // Check if table exists
    try {
      await query(`SELECT 1 FROM statements LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ error: 'Statements not available' }, { status: 404 })
    }

    // Get statement details
    const statementRes = await query(
      `SELECT 
        s.*
       FROM statements s
       WHERE s.id = $1 AND s.user_id = $2`,
      [statementId, payload.userId]
    )

    if (statementRes.rows.length === 0) {
      return NextResponse.json({ error: 'Statement not found' }, { status: 404 })
    }

    const statement = statementRes.rows[0]

    // Get transactions in this statement period
    const transactionsRes = await query(
      `SELECT 
        t.id, 
        t.description, 
        t.amount, 
        t.type, 
        t.status,
        t.created_at as "date"
       FROM transactions t
       WHERE t."accountId" = $1 
         AND t.created_at >= $2
         AND t.created_at <= $3 + INTERVAL '1 day' - INTERVAL '1 second'
       ORDER BY t.created_at DESC`,
      [statement.account_id, statement.period_start, statement.period_end]
    )

    return NextResponse.json({
      statement,
      transactions: transactionsRes.rows
    })
  } catch (error) {
    console.error('Error fetching statement:', error)
    return NextResponse.json({ error: 'Failed to fetch statement' }, { status: 500 })
  }
}
