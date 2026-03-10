import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Test user query
    const userRes = await query(
      'SELECT id, email, "firstName", "lastName" FROM users WHERE id = $1',
      [payload.userId]
    )

    // Test accounts query
    const accountsRes = await query(
      'SELECT * FROM accounts WHERE "userId" = $1',
      [payload.userId]
    )

    return NextResponse.json({
      user: userRes.rows[0],
      accounts: accountsRes.rows,
      token: payload
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
