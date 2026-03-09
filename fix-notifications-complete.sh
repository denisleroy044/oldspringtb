#!/bin/bash

echo "🔔 Fixing Complete Notifications System"
echo "========================================"
echo ""

# Step 1: Fix notifications API with better error handling
cat > src/app/api/notifications/route.ts << 'EOF'
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

    // Check if notifications table exists and create if not
    try {
      await query(`SELECT 1 FROM notifications LIMIT 1`)
    } catch (tableError) {
      console.log('Creating notifications table...')
      await query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          data JSONB,
          "isRead" BOOLEAN DEFAULT false,
          "actionUrl" TEXT,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `)

      await query(`
        CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications("userId");
        CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications("isRead");
        CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications("createdAt");
      `)
      console.log('Notifications table created successfully')
    }

    // Get user's notifications
    const result = await query(
      `SELECT 
        id, type, title, message, data, "isRead", "actionUrl", "createdAt"
       FROM notifications
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 50`,
      [payload.userId]
    )

    console.log(`Found ${result.rows.length} notifications for user`)
    
    // Calculate unread count
    const unreadCount = result.rows.filter(n => !n.isRead).length

    return NextResponse.json({ 
      notifications: result.rows || [],
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ 
      notifications: [],
      unreadCount: 0,
      error: 'Failed to fetch notifications' 
    }, { status: 500 })
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
       SET "isRead" = true, "updatedAt" = NOW() 
       WHERE id = $1 AND "userId" = $2`,
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
    
    const result = await query(
      `INSERT INTO notifications (
        id, "userId", type, title, message, data, "actionUrl", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id`,
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

    return NextResponse.json({ success: true, id: result.rows[0].id })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
