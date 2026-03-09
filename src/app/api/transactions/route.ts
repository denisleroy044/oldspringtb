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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')

    // Based on the actual schema, we need to handle both sender and receiver accounts
    let queryText = `
      SELECT 
        t.id,
        t.description,
        t.amount,
        t.type,
        t.status,
        t.reference,
        t."createdAt" as date,
        t."senderAccountId",
        t."receiverAccountId",
        CASE 
          WHEN t.type = 'DEPOSIT' THEN 'credit'
          WHEN t.type = 'WITHDRAWAL' THEN 'debit'
          WHEN t.type = 'PAYMENT' THEN 'debit'
          WHEN t.type = 'TRANSFER' THEN 'transfer'
          ELSE 'debit'
        END as "transactionType",
        CASE
          WHEN t.type = 'DEPOSIT' THEN (
            SELECT a."accountType" FROM accounts a WHERE a.id = t."receiverAccountId"
          )
          WHEN t.type = 'WITHDRAWAL' THEN (
            SELECT a."accountType" FROM accounts a WHERE a.id = t."senderAccountId"
          )
          WHEN t.type = 'PAYMENT' THEN (
            SELECT a."accountType" FROM accounts a WHERE a.id = t."senderAccountId"
          )
          WHEN t.type = 'TRANSFER' THEN (
            SELECT a."accountType" FROM accounts a WHERE a.id = t."senderAccountId"
          )
        END as "accountType",
        CASE
          WHEN t.type = 'DEPOSIT' THEN (
            SELECT a."accountNumber" FROM accounts a WHERE a.id = t."receiverAccountId"
          )
          WHEN t.type = 'WITHDRAWAL' THEN (
            SELECT a."accountNumber" FROM accounts a WHERE a.id = t."senderAccountId"
          )
          WHEN t.type = 'PAYMENT' THEN (
            SELECT a."accountNumber" FROM accounts a WHERE a.id = t."senderAccountId"
          )
          WHEN t.type = 'TRANSFER' THEN (
            SELECT a."accountNumber" FROM accounts a WHERE a.id = t."senderAccountId"
          )
        END as "accountNumber",
        CASE
          WHEN t.type = 'DEPOSIT' THEN t."receiverAccountId"
          ELSE t."senderAccountId"
        END as "accountId"
      FROM transactions t
      WHERE t."userId" = $1
    `

    const params: any[] = [payload.userId]
    let paramIndex = 2

    if (type && type !== 'all') {
      if (type === 'credit') {
        queryText += ` AND t.type IN ('DEPOSIT')`
      } else if (type === 'debit') {
        queryText += ` AND t.type IN ('PAYMENT', 'WITHDRAWAL')`
      } else if (type === 'transfer') {
        queryText += ` AND t.type = 'TRANSFER'`
      }
    }

    queryText += ` ORDER BY t."createdAt" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    console.log('📝 Executing transactions query...')
    const transactionsRes = await query(queryText, params)

    // Get total count for pagination
    const countRes = await query(
      `SELECT COUNT(*) as total FROM transactions WHERE "userId" = $1`,
      [payload.userId]
    )

    const transactions = transactionsRes.rows.map(t => ({
      id: t.id,
      description: t.description || 'Transaction',
      amount: parseFloat(t.amount || 0),
      type: t.transactionType,
      category: getCategoryFromDescription(t.description, t.type),
      date: formatDate(t.date),
      fullDate: t.date,
      accountId: t.accountId,
      accountType: t.accountType || 'Account',
      accountNumber: maskAccountNumber(t.accountNumber),
      reference: t.reference,
      status: (t.status || 'completed').toLowerCase()
    }))

    return NextResponse.json({
      transactions,
      total: parseInt(countRes.rows[0]?.total || 0),
      limit,
      offset
    })

  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json(
      { error: 'Failed to load transactions: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}

function maskAccountNumber(number: string): string {
  if (!number || number.length < 4) return '****'
  return `•••• ${number.slice(-4)}`
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Today'
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }
}

function getCategoryFromDescription(desc: string, type: string): string {
  if (!desc) return 'Other'
  
  if (type === 'DEPOSIT') return 'Income'
  if (type === 'TRANSFER') return 'Transfer'
  
  const lower = desc.toLowerCase()
  if (lower.includes('amazon') || lower.includes('walmar') || lower.includes('target')) return 'Shopping'
  if (lower.includes('whole foods') || lower.includes('grocery') || lower.includes('kroger')) return 'Groceries'
  if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('hulu')) return 'Entertainment'
  if (lower.includes('uber') || lower.includes('lyft') || lower.includes('taxi')) return 'Transportation'
  if (lower.includes('payment') || lower.includes('bill')) return 'Bills'
  return 'Other'
}
