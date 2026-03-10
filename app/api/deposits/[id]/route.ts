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

    const depositId = params.id

    const result = await query(
      `SELECT 
        id, amount, method, "cryptoCurrency", status, "transactionId" as reference,
        "senderInfo", "adminNotes", "createdAt", "updatedAt", "completedAt"
       FROM deposits
       WHERE id = $1 AND "userId" = $2`,
      [depositId, payload.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    }

    return NextResponse.json({ deposit: result.rows[0] })
  } catch (error) {
    console.error('Error fetching deposit:', error)
    return NextResponse.json({ error: 'Failed to fetch deposit' }, { status: 500 })
  }
}
