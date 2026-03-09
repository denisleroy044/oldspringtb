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
      await query(`SELECT 1 FROM loan_offers LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ offers: [] })
    }

    const result = await query(
      `SELECT 
        lo.id, 
        lo.offer_name as "offerName", 
        lo.amount, 
        lo.term, 
        lo.interest_rate as "interestRate", 
        lo.monthly_payment as "monthlyPayment",
        lo.total_interest as "totalInterest", 
        lo.total_payment as "totalPayment",
        lo.processing_fee as "processingFee", 
        lo.expiry_date as "expiryDate",
        lo.message, 
        lo.status, 
        lo.created_at as "createdAt",
        lp.name as "productName", 
        lp.category as "productCategory"
       FROM loan_offers lo
       LEFT JOIN loan_products lp ON lo.product_id = lp.id
       WHERE lo.user_id = $1
       ORDER BY 
        CASE lo.status 
          WHEN 'PENDING' THEN 1 
          WHEN 'ACCEPTED' THEN 2 
          ELSE 3 
        END,
        lo.created_at DESC`,
      [payload.userId]
    )

    return NextResponse.json({ offers: result.rows || [] })
  } catch (error) {
    console.error('Error fetching loan offers:', error)
    return NextResponse.json({ offers: [] })
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

    const { offerId, action } = await req.json()

    // Get offer details
    const offerRes = await query(
      `SELECT * FROM loan_offers WHERE id = $1 AND user_id = $2`,
      [offerId, payload.userId]
    )

    if (offerRes.rows.length === 0) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    const offer = offerRes.rows[0]

    // Update offer status
    await query(
      `UPDATE loan_offers 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 AND user_id = $3`,
      [action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED', offerId, payload.userId]
    )

    if (action === 'ACCEPT') {
      // Create application from offer
      const applicationNumber = `LOAN-${Date.now().toString(36).toUpperCase()}`
      
      await query(
        `INSERT INTO loan_applications (
          id, user_id, offer_id, product_id, application_number,
          amount, term, interest_rate, monthly_payment, total_payment, processing_fee,
          status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
        [
          `loan_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          payload.userId,
          offerId,
          offer.product_id,
          applicationNumber,
          offer.amount,
          offer.term,
          offer.interest_rate,
          offer.monthly_payment,
          offer.total_payment,
          offer.processing_fee,
          'UNDER_REVIEW'
        ]
      )

      // Create notification for admin
      try {
        await query(
          `INSERT INTO notifications (
            id, user_id, type, title, message, data, is_read, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [
            `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
            'admin',
            'loan',
            'Loan Offer Accepted',
            `User has accepted a loan offer for $${offer.amount}`,
            JSON.stringify({ offerId, userId: payload.userId, amount: offer.amount }),
            false
          ]
        )
      } catch (notifError) {
        console.error('Failed to create admin notification:', notifError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error responding to offer:', error)
    return NextResponse.json({ error: 'Failed to process offer' }, { status: 500 })
  }
}
