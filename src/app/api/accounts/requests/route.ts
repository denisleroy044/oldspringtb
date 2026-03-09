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

    // Get all account requests for the user
    const requestsRes = await query(
      `SELECT id, "accountType", status, "createdAt"
       FROM account_requests 
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [payload.userId]
    )

    const requests = requestsRes.rows.map(req => ({
      id: req.id,
      accountType: req.accountType,
      status: req.status,
      createdAt: req.createdAt
    }))

    return NextResponse.json({ requests })

  } catch (error) {
    console.error('Account requests API error:', error)
    return NextResponse.json(
      { error: 'Failed to load requests' },
      { status: 500 }
    )
  }
}
