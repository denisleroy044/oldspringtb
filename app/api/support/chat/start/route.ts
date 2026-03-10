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

    // Check if table exists
    try {
      await query(`SELECT 1 FROM live_chat_sessions LIMIT 1`)
    } catch (tableError) {
      // Create the table
      await query(`
        CREATE TABLE IF NOT EXISTS live_chat_sessions (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          session_id TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'active',
          assigned_to TEXT,
          started_at TIMESTAMP DEFAULT NOW(),
          ended_at TIMESTAMP,
          rating INTEGER,
          feedback TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `)

      await query(`
        CREATE TABLE IF NOT EXISTS live_chat_messages (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          session_id TEXT NOT NULL REFERENCES live_chat_sessions(id) ON DELETE CASCADE,
          user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
          admin_id TEXT,
          message TEXT NOT NULL,
          is_admin BOOLEAN DEFAULT false,
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `)
    }

    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

    const result = await query(
      `INSERT INTO live_chat_sessions (
        id, user_id, session_id, status, started_at, created_at
      ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id`,
      [
        `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        payload.userId,
        sessionId,
        'active'
      ]
    )

    return NextResponse.json({ 
      success: true, 
      chatId: result.rows[0].id,
      sessionId 
    })
  } catch (error) {
    console.error('Error starting chat:', error)
    return NextResponse.json({ error: 'Failed to start chat' }, { status: 500 })
  }
}
