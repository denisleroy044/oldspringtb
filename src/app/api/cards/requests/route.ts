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

    // Check if card_requests table exists (lowercase)
    try {
      const tableCheck = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'card_requests'
        )`
      )
      
      const tableExists = tableCheck.rows[0]?.exists || false
      
      if (!tableExists) {
        return NextResponse.json({ requests: [] })
      }
    } catch (tableError) {
      return NextResponse.json({ requests: [] })
    }

    // Get all card requests for the user (lowercase table name)
    const requestsRes = await query(
      `SELECT id, "cardType", "cardBrand", status, "createdAt"
       FROM card_requests
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [payload.userId]
    )

    const requests = requestsRes.rows.map(req => ({
      id: req.id,
      cardType: req.cardType,
      cardBrand: req.cardBrand,
      status: req.status,
      createdAt: req.createdAt
    }))

    return NextResponse.json({ requests })

  } catch (error) {
    console.error('Card requests API error:', error)
    return NextResponse.json({ requests: [] })
  }
}
