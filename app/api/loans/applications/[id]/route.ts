import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function GET(
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

    const applicationId = params.id

    // Get application details
    const appRes = await query(
      `SELECT 
        la.*,
        lp.name as "productName", lp.category as "productCategory",
        lp.requirements, lp.documents_required as "documentsRequired",
        u.email, u."firstName", u."lastName"
       FROM loan_applications la
       LEFT JOIN loan_products lp ON la.product_id = lp.id
       LEFT JOIN users u ON la.user_id = u.id
       WHERE la.id = $1 AND la.user_id = $2`,
      [applicationId, payload.userId]
    )

    if (appRes.rows.length === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const application = appRes.rows[0]

    // Get repayment schedule if approved
    let schedule = []
    if (application.status === 'APPROVED' || application.status === 'DISBURSED') {
      const scheduleRes = await query(
        `SELECT 
          id, installment_number as "installmentNumber",
          due_date as "dueDate", amount, principal, interest, fee,
          paid_amount as "paidAmount", paid_date as "paidDate", status
         FROM loan_repayment_schedules
         WHERE loan_id = $1
         ORDER BY installment_number ASC`,
        [applicationId]
      )
      schedule = scheduleRes.rows
    }

    // Get payment history
    const paymentsRes = await query(
      `SELECT 
        id, amount, principal, interest, fee, payment_method as "paymentMethod",
        transaction_id as "transactionId", reference, paid_at as "paidAt"
       FROM loan_repayments
       WHERE loan_id = $1
       ORDER BY paid_at DESC`,
      [applicationId]
    )

    return NextResponse.json({ 
      application,
      schedule,
      payments: paymentsRes.rows
    })
  } catch (error) {
    console.error('Error fetching loan application:', error)
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
  }
}
