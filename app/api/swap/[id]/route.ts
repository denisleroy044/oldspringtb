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

    const swapId = params.id

    const result = await query(
      `SELECT 
        id,
        from_currency as "fromCurrency",
        to_currency as "toCurrency",
        from_amount as "fromAmount",
        to_amount as "toAmount",
        exchange_rate as "rate",
        fee,
        reference,
        status,
        completed_at as "completedAt",
        created_at as "createdAt"
       FROM swap_requests
       WHERE id = $1 AND user_id = $2`,
      [swapId, payload.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Swap not found' }, { status: 404 })
    }

    return NextResponse.json({ swap: result.rows[0] })
  } catch (error) {
    console.error('Error fetching swap:', error)
    return NextResponse.json({ error: 'Failed to fetch swap' }, { status: 500 })
  }
}
