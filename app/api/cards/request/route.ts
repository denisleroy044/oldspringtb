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

    const { cardType, cardBrand, accountId } = await req.json()

    // First, check if the card_requests table exists (lowercase)
    try {
      const tableCheck = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'card_requests'
        )`
      )
      
      const tableExists = tableCheck.rows[0]?.exists || false
      
      if (!tableExists) {
        console.error('card_requests table does not exist in database')
        return NextResponse.json(
          { error: 'Card request system is being set up. Please try again later.' },
          { status: 503 }
        )
      }
    } catch (tableError) {
      console.error('Error checking for card_requests table:', tableError)
      return NextResponse.json(
        { error: 'Database error. Please try again later.' },
        { status: 500 }
      )
    }

    // Check if there's already a pending request of this type (lowercase table name)
    const existingRes = await query(
      `SELECT id FROM card_requests 
       WHERE "userId" = $1 AND "cardType" = $2 AND status = 'PENDING'`,
      [payload.userId, cardType]
    )

    if (existingRes.rows.length > 0) {
      return NextResponse.json(
        { error: 'You already have a pending request for this card type' },
        { status: 400 }
      )
    }

    // Create the request (lowercase table name)
    const crypto = require('crypto')
    const requestId = crypto.randomUUID()

    await query(
      `INSERT INTO card_requests (id, "userId", "accountId", "cardType", "cardBrand", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [requestId, payload.userId, accountId || null, cardType, cardBrand, 'PENDING']
    )

    return NextResponse.json({ 
      success: true, 
      requestId,
      message: 'Card request submitted successfully'
    })

  } catch (error) {
    console.error('Card request error:', error)
    return NextResponse.json(
      { error: 'Failed to submit request: ' + error.message },
      { status: 500 }
    )
  }
}
