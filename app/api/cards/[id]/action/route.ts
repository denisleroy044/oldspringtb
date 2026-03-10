import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const cardId = params.id
    const { action } = await req.json()

    // Verify card belongs to user
    const cardRes = await query(
      'SELECT id, status FROM cards WHERE id = $1 AND "userId" = $2',
      [cardId, payload.userId]
    )

    if (cardRes.rows.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    let newStatus = ''
    let responseMessage = ''

    switch(action) {
      case 'freeze':
        newStatus = 'FROZEN'
        responseMessage = 'Card frozen successfully'
        break
      case 'unfreeze':
        newStatus = 'ACTIVE'
        responseMessage = 'Card unfrozen successfully'
        break
      case 'report-lost':
        newStatus = 'BLOCKED'
        responseMessage = 'Card reported as lost/stolen. A replacement will be sent.'
        break
      case 'replace':
        // For replacement, we create a new card and deactivate the old one
        // Get card details
        const oldCard = cardRes.rows[0]
        
        // Generate new card details (in production, you'd have a card generation service)
        const crypto = require('crypto')
        const newCardId = crypto.randomUUID()
        
        // Copy card details but with new number and expiry
        // For demo, we'll just update status
        newStatus = 'REPLACED'
        responseMessage = 'Replacement card requested. You will receive it in 5-7 business days.'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update card status
    await query(
      'UPDATE cards SET status = $1, "updatedAt" = NOW() WHERE id = $2',
      [newStatus, cardId]
    )

    return NextResponse.json({ 
      success: true, 
      message: responseMessage 
    })

  } catch (error) {
    console.error('Card action error:', error)
    return NextResponse.json(
      { error: 'Failed to process card action' },
      { status: 500 }
    )
  }
}
