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

    const { chatId, message } = await req.json()

    // Verify the chat session belongs to the user
    const sessionCheck = await query(
      `SELECT id FROM live_chat_sessions 
       WHERE id = $1 AND user_id = $2 AND status = 'active'`,
      [chatId, payload.userId]
    )

    if (sessionCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 })
    }

    await query(
      `INSERT INTO live_chat_messages (
        id, session_id, user_id, message, created_at
      ) VALUES ($1, $2, $3, $4, NOW())`,
      [
        `msg_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        chatId,
        payload.userId,
        message
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
