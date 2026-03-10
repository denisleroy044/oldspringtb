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

    // Get all accounts for the user
    const accountsRes = await query(
      `SELECT id, "accountType", balance, currency, "accountNumber", status, "createdAt"
       FROM accounts 
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [payload.userId]
    )

    const accounts = accountsRes.rows.map(acc => ({
      id: acc.id,
      type: acc.accountType,
      displayName: acc.accountType === 'CHECKING' ? 'Checking Account' :
                   acc.accountType === 'SAVINGS' ? 'Savings Account' :
                   acc.accountType === 'BUSINESS' ? 'Business Account' : 'Account',
      accountNumber: acc.accountNumber,
      maskedNumber: acc.accountNumber ? `****${acc.accountNumber.slice(-4)}` : '****1234',
      balance: parseFloat(acc.balance || 0),
      currency: acc.currency || 'USD',
      status: acc.status,
      createdAt: acc.createdAt
    }))

    return NextResponse.json({ accounts })

  } catch (error) {
    console.error('Accounts API error:', error)
    return NextResponse.json(
      { error: 'Failed to load accounts' },
      { status: 500 }
    )
  }
}
