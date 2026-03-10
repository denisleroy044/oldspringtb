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

    console.log('Fetching notifications for user:', payload.userId)

    // Get user's notifications using correct column names
    const result = await query(
      `SELECT 
        id, 
        type, 
        title, 
        message, 
        data, 
        is_read as "isRead", 
        action_url as "actionUrl", 
        created_at as "createdAt"
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [payload.userId]
    )

    console.log(`Found ${result.rows.length} notifications`)
    
    // Calculate unread count
    const unreadCount = result.rows.filter((n: any) => !n.isRead).length

    return NextResponse.json({ 
      notifications: result.rows || [],
      unreadCount
    })
  } catch (error) {
    console.error('Error in notifications API:', error)
    return NextResponse.json({ 
      notifications: [],
      unreadCount: 0
    })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { notificationId } = await req.json()

    await query(
      `UPDATE notifications 
       SET is_read = true, updated_at = NOW() 
       WHERE id = $1 AND user_id = $2`,
      [notificationId, payload.userId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
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

    const { type, title, message, data, actionUrl } = await req.json()

    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
    
    await query(
      `INSERT INTO notifications (
        id, user_id, type, title, message, data, action_url, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [
        notificationId,
        payload.userId,
        type || 'system',
        title,
        message,
        data ? JSON.stringify(data) : null,
        actionUrl || null
      ]
    )

    return NextResponse.json({ success: true, id: notificationId })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
