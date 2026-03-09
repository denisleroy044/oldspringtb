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

    const searchParams = req.nextUrl.searchParams
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    const type = searchParams.get('type')

    // Check if table exists
    try {
      await query(`SELECT 1 FROM calendar_events LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ events: [] })
    }

    let queryText = `
      SELECT 
        id,
        title,
        description,
        event_type as "eventType",
        start_date as "start",
        end_date as "end",
        all_day as "allDay",
        location,
        color,
        repeat_type as "repeatType",
        repeat_interval as "repeatInterval",
        repeat_end_date as "repeatEndDate",
        reminder_time as "reminderTime",
        status,
        metadata,
        created_at as "createdAt"
      FROM calendar_events
      WHERE user_id = $1
    `

    const params: any[] = [payload.userId]
    let paramIndex = 2

    if (startDate) {
      queryText += ` AND start_date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      queryText += ` AND start_date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    if (type && type !== 'all') {
      queryText += ` AND event_type = $${paramIndex}`
      params.push(type)
      paramIndex++
    }

    queryText += ` ORDER BY start_date ASC`

    const result = await query(queryText, params)

    return NextResponse.json({ events: result.rows || [] })
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json({ events: [] })
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

    const eventId = `event_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

    await query(
      `INSERT INTO calendar_events (
        id, user_id, title, description, event_type, start_date, end_date,
        all_day, location, color, repeat_type, repeat_interval, repeat_end_date,
        reminder_time, status, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())`,
      [
        eventId,
        payload.userId,
        data.title,
        data.description || null,
        data.eventType || 'reminder',
        data.start,
        data.end || null,
        data.allDay || false,
        data.location || null,
        data.color || '#3b82f6',
        data.repeatType || 'none',
        data.repeatInterval || 1,
        data.repeatEndDate || null,
        data.reminderTime || null,
        'active',
        data.metadata ? JSON.stringify(data.metadata) : null
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
          'calendar',
          'New Event Created',
          `Event "${data.title}" has been added to your calendar.`,
          JSON.stringify({ eventId, title: data.title, date: data.start }),
          '/dashboard/calendar'
        ]
      )
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json({ success: true, id: eventId })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
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

    const { id, ...updates } = await req.json()

    const setClauses = []
    const values = [id, payload.userId]
    let paramIndex = 3

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const column = key === 'eventType' ? 'event_type' :
                      key === 'start' ? 'start_date' :
                      key === 'end' ? 'end_date' :
                      key === 'allDay' ? 'all_day' :
                      key === 'repeatType' ? 'repeat_type' :
                      key === 'repeatInterval' ? 'repeat_interval' :
                      key === 'repeatEndDate' ? 'repeat_end_date' :
                      key === 'reminderTime' ? 'reminder_time' :
                      key
        setClauses.push(`"${column}" = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    setClauses.push('updated_at = NOW()')

    await query(
      `UPDATE calendar_events 
       SET ${setClauses.join(', ')}
       WHERE id = $1 AND user_id = $2`,
      values
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
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

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    await query(
      `DELETE FROM calendar_events WHERE id = $1 AND user_id = $2`,
      [id, payload.userId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
