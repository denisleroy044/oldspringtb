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

    // Check if deposits table exists
    try {
      await query(`SELECT 1 FROM deposits LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ deposits: [] })
    }

    // Get all deposit requests for the user
    const result = await query(
      `SELECT
        id, amount, method, status, "transactionId" as reference, "createdAt"
       FROM deposits
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [payload.userId]
    )

    return NextResponse.json({ deposits: result.rows || [] })
  } catch (error) {
    console.error('Error fetching deposit requests:', error)
    return NextResponse.json({ deposits: [] }, { status: 500 })
  }
}
