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

    // Check if table exists
    try {
      await query(`SELECT 1 FROM user_sessions LIMIT 1`)
    } catch (tableError) {
      // Return empty array if table doesn't exist
      return NextResponse.json({ sessions: [] })
    }

    // Get current session token
    const currentToken = token

    const result = await query(
      `SELECT 
        id,
        device_name as "deviceName",
        device_type as "deviceType",
        browser,
        os,
        ip_address as "ipAddress",
        location,
        session_token = $2 as "isCurrent",
        last_active as "lastActive",
        created_at as "createdAt"
       FROM user_sessions 
       WHERE user_id = $1
       ORDER BY last_active DESC`,
      [payload.userId, currentToken]
    )

    return NextResponse.json({ sessions: result.rows })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ sessions: [] })
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

    const { sessionId, all } = await req.json()

    if (all) {
      // Revoke all sessions except current
      await query(
        `DELETE FROM user_sessions 
         WHERE user_id = $1 AND session_token != $2`,
        [payload.userId, token]
      )
    } else if (sessionId) {
      // Revoke specific session
      await query(
        `DELETE FROM user_sessions 
         WHERE id = $1 AND user_id = $2 AND session_token != $3`,
        [sessionId, payload.userId, token]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error revoking sessions:', error)
    return NextResponse.json({ error: 'Failed to revoke sessions' }, { status: 500 })
  }
}

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

    const data = await req.json()

    // Check if table exists
    try {
      await query(`SELECT 1 FROM user_sessions LIMIT 1`)
    } catch (tableError) {
      // Create the table
      await query(`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          session_token TEXT UNIQUE NOT NULL,
          device_name TEXT,
          device_type TEXT,
          browser TEXT,
          os TEXT,
          ip_address TEXT,
          location TEXT,
          last_active TIMESTAMP DEFAULT NOW(),
          expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `)
    }

    // Insert new session
    await query(
      `INSERT INTO user_sessions (
        id, user_id, session_token, device_name, device_type,
        browser, os, ip_address, location, last_active, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [
        `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        payload.userId,
        token,
        data.deviceName || 'Unknown Device',
        data.deviceType || 'desktop',
        data.browser || 'Unknown',
        data.os || 'Unknown',
        data.ipAddress || req.headers.get('x-forwarded-for') || req.ip,
        data.location || 'Unknown'
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
