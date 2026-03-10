import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { chatId } = await req.json()

    await query(
      `UPDATE live_chat_sessions 
       SET status = 'ended', ended_at = NOW() 
       WHERE id = $1 AND user_id = $2`,
      [chatId, payload.userId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error ending chat:', error)
    return NextResponse.json({ error: 'Failed to end chat' }, { status: 500 })
  }
}
