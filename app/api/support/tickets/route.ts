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
      await query(`SELECT 1 FROM support_tickets LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ tickets: [] })
    }

    const result = await query(
      `SELECT 
        id,
        ticket_number as "ticketNumber",
        category,
        subject,
        priority,
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
       FROM support_tickets 
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [payload.userId]
    )

    return NextResponse.json({ tickets: result.rows })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ tickets: [] })
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

    const { category, subject, description, priority } = await req.json()

    // Check if table exists
    try {
      await query(`SELECT 1 FROM support_tickets LIMIT 1`)
    } catch (tableError) {
      // Create the table
      await query(`
        CREATE TABLE IF NOT EXISTS support_tickets (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          ticket_number TEXT UNIQUE NOT NULL,
          category TEXT NOT NULL,
          subject TEXT NOT NULL,
          description TEXT NOT NULL,
          priority TEXT DEFAULT 'medium',
          status TEXT DEFAULT 'open',
          attachments JSONB[],
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          resolved_at TIMESTAMP,
          closed_at TIMESTAMP
        )
      `)
    }

    // Generate ticket number
    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`

    const result = await query(
      `INSERT INTO support_tickets (
        id, user_id, ticket_number, category, subject, description, priority, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, ticket_number`,
      [
        `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        payload.userId,
        ticketNumber,
        category,
        subject,
        description,
        priority || 'medium'
      ]
    )

    // Create notification
    try {
      await query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, data, action_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          payload.userId,
          'support',
          'Support Ticket Created',
          `Your support ticket ${ticketNumber} has been created successfully.`,
          JSON.stringify({ ticketId: result.rows[0].id, ticketNumber }),
          '/dashboard/support'
        ]
      )
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json({ 
      success: true, 
      id: result.rows[0].id,
      ticketNumber: result.rows[0].ticket_number
    })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}
