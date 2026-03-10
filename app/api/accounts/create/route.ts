import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

function generateAccountNumber(prefix: string): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 9000 + 1000).toString()
  return `${prefix}${timestamp}${random}`
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

    const { accountType } = await req.json()
    
    // Map account type to database values
    let dbAccountType = 'CHECKING'
    let accountName = 'Checking Account'
    let prefix = '033'

    switch(accountType) {
      case 'checking':
        dbAccountType = 'CHECKING'
        accountName = 'Checking Account'
        prefix = '033'
        break
      case 'savings':
        dbAccountType = 'SAVINGS'
        accountName = 'Savings Account'
        prefix = '077'
        break
      case 'business':
        dbAccountType = 'CHECKING'
        accountName = 'Business Checking'
        prefix = '055'
        break
    }

    const accountNumber = generateAccountNumber(prefix)
    const crypto = require('crypto')
    const accountId = crypto.randomUUID()

    await query(
      `INSERT INTO accounts (id, "accountType", balance, currency, "accountNumber", status, "userId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [accountId, dbAccountType, 0, 'USD', accountNumber, 'ACTIVE', payload.userId]
    )

    return NextResponse.json({
      success: true,
      accountId,
      accountNumber
    })

  } catch (error) {
    console.error('Create account error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
