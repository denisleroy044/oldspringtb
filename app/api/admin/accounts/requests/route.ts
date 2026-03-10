import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'
import { generateAccountNumber } from '@/lib/utils/accountNumber'

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

    // Check if user is admin
    const userRes = await query(
      'SELECT role FROM users WHERE id = $1',
      [payload.userId]
    )

    if (userRes.rows[0]?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all pending requests with user info
    const requestsRes = await query(
      `SELECT r.id, r."accountType", r.status, r."createdAt",
              u.email, u."firstName", u."lastName"
       FROM account_requests r
       JOIN users u ON r."userId" = u.id
       WHERE r.status = 'PENDING'
       ORDER BY r."createdAt" ASC`
    )

    return NextResponse.json({ requests: requestsRes.rows })

  } catch (error) {
    console.error('Admin requests API error:', error)
    return NextResponse.json(
      { error: 'Failed to load requests' },
      { status: 500 }
    )
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

    // Check if user is admin
    const userRes = await query(
      'SELECT role FROM users WHERE id = $1',
      [payload.userId]
    )

    if (userRes.rows[0]?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { requestId, action, adminNotes } = await req.json()

    if (action === 'approve') {
      // Get the request details
      const requestRes = await query(
        'SELECT * FROM account_requests WHERE id = $1',
        [requestId]
      )

      const request = requestRes.rows[0]
      if (!request) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 })
      }

      // Generate account number based on type
      const crypto = require('crypto')
      const accountId = crypto.randomUUID()
      
      // Determine if business or personal (you may need to get this from user data)
      const isBusiness = false // You'll need to determine this from user data
      
      // Map account type to prefix
      let accountType = request.accountType
      let displayName = ''
      
      switch(request.accountType) {
        case 'CHECKING':
          displayName = isBusiness ? 'Business Checking' : 'Checking Account'
          break
        case 'SAVINGS':
          displayName = isBusiness ? 'Business Savings' : 'Savings Account'
          break
        default:
          displayName = 'Account'
      }

      // Generate account number
      const accountNumber = generateAccountNumber(
        request.accountType === 'CHECKING' ? 'checking' : 
        request.accountType === 'SAVINGS' ? 'savings' : 'checking', 
        isBusiness
      )

      // Create the account
      await query(
        `INSERT INTO accounts (id, "userId", "accountType", "accountNumber", balance, currency, status, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [accountId, request.userId, request.accountType, accountNumber, 0, 'USD', 'ACTIVE']
      )

      // Update request status
      await query(
        `UPDATE account_requests 
         SET status = 'APPROVED', "adminNotes" = $1, "reviewedAt" = NOW(), "updatedAt" = NOW()
         WHERE id = $2`,
        [adminNotes || 'Approved', requestId]
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Account approved and created',
        accountNumber
      })

    } else if (action === 'reject') {
      // Update request status
      await query(
        `UPDATE account_requests 
         SET status = 'REJECTED', "adminNotes" = $1, "reviewedAt" = NOW(), "updatedAt" = NOW()
         WHERE id = $2`,
        [adminNotes || 'Rejected', requestId]
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Request rejected'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Admin review API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
