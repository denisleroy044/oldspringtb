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

    const result = await query(
      `SELECT 
        id,
        method,
        nickname,
        account_holder as "accountHolder",
        account_number as "accountNumber",
        routing_number as "routingNumber",
        bank_name as "bankName",
        wallet_address as "walletAddress",
        email,
        phone,
        is_default as "isDefault",
        last_used as "lastUsed"
       FROM user_withdrawal_methods
       WHERE user_id = $1
       ORDER BY is_default DESC, last_used DESC NULLS LAST, created_at DESC`,
      [payload.userId]
    )

    return NextResponse.json({ methods: result.rows || [] })
  } catch (error) {
    console.error('Error fetching saved methods:', error)
    return NextResponse.json({ methods: [] }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { methodId } = await req.json()

    await query(
      `DELETE FROM user_withdrawal_methods WHERE id = $1 AND user_id = $2`,
      [methodId, payload.userId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved method:', error)
    return NextResponse.json({ error: 'Failed to delete method' }, { status: 500 })
  }
}
