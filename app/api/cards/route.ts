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

    // Check if cards table exists (lowercase)
    try {
      const tableCheck = await query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'cards'
        )`
      )
      
      const tableExists = tableCheck.rows[0]?.exists || false
      
      if (!tableExists) {
        console.log('Cards table does not exist yet')
        return NextResponse.json({ cards: [] })
      }
    } catch (tableError) {
      console.log('Error checking cards table:', tableError)
      return NextResponse.json({ cards: [] })
    }

    // Get all cards for the user with account info (lowercase table names)
    const cardsRes = await query(
      `SELECT c.*, a."accountType" as "accountType", a."accountNumber" as "accountNumber"
       FROM cards c
       LEFT JOIN accounts a ON c."accountId" = a.id
       WHERE c."userId" = $1
       ORDER BY c."createdAt" DESC`,
      [payload.userId]
    )

    const cards = cardsRes.rows.map(card => ({
      id: card.id,
      cardType: card.cardType,
      cardBrand: card.cardBrand,
      lastFour: card.lastFour,
      cardholderName: card.cardholderName,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      status: card.status,
      isVirtual: card.isVirtual,
      creditLimit: card.creditLimit ? parseFloat(card.creditLimit) : null,
      availableCredit: card.availableCredit ? parseFloat(card.availableCredit) : null,
      currentBalance: card.currentBalance ? parseFloat(card.currentBalance) : 0,
      rewardsPoints: card.rewardsPoints,
      accountId: card.accountId,
      accountName: card.accountType ? 
        (card.accountType === 'CHECKING' ? 'Checking Account' : 
         card.accountType === 'SAVINGS' ? 'Savings Account' : 'Account') : null
    }))

    return NextResponse.json({ cards })

  } catch (error) {
    console.error('Cards API error:', error)
    return NextResponse.json({ cards: [] })
  }
}
