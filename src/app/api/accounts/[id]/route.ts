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

    const accountId = params.id

    // Get account details
    const accountRes = await query(
      `SELECT id, "accountType", balance, currency, "accountNumber", status, "createdAt"
       FROM accounts 
       WHERE id = $1 AND "userId" = $2`,
      [accountId, payload.userId]
    )

    if (accountRes.rows.length === 0) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    const account = accountRes.rows[0]

    // Get recent transactions for this account
    const transactionsRes = await query(
      `SELECT id, description, amount, type, status, "createdAt"
       FROM transactions 
       WHERE "accountId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 10`,
      [accountId]
    )

    const transactions = transactionsRes.rows.map(t => ({
      id: t.id,
      description: t.description,
      amount: parseFloat(t.amount),
      type: t.type === 'DEPOSIT' ? 'credit' : 'debit',
      status: t.status?.toLowerCase() || 'completed',
      date: t.createdAt
    }))

    return NextResponse.json({
      account: {
        id: account.id,
        type: account.accountType,
        displayName: account.accountType === 'CHECKING' ? 'Checking Account' :
                     account.accountType === 'SAVINGS' ? 'Savings Account' :
                     account.accountType === 'BUSINESS' ? 'Business Account' : 'Account',
        accountNumber: account.accountNumber,
        balance: parseFloat(account.balance),
        currency: account.currency,
        status: account.status,
        createdAt: account.createdAt
      },
      transactions
    })

  } catch (error) {
    console.error('Account detail API error:', error)
    return NextResponse.json(
      { error: 'Failed to load account details' },
      { status: 500 }
    )
  }
}
