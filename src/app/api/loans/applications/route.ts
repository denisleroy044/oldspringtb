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
      await query(`SELECT 1 FROM loan_applications LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ applications: [] })
    }

    const result = await query(
      `SELECT 
        la.id, 
        la.application_number as "applicationNumber",
        la.amount, 
        la.term,
        la.purpose, 
        la.status, 
        la.created_at as "createdAt", 
        la.approved_at as "approvedAt",
        la.disbursed_at as "disbursedAt", 
        la.monthly_payment as "monthlyPayment",
        la.interest_rate as "interestRate",
        lp.name as "productName", 
        lp.category as "productCategory"
       FROM loan_applications la
       LEFT JOIN loan_products lp ON la.product_id = lp.id
       WHERE la.user_id = $1
       ORDER BY 
        CASE la.status 
          WHEN 'PENDING' THEN 1
          WHEN 'UNDER_REVIEW' THEN 2
          WHEN 'APPROVED' THEN 3
          WHEN 'DISBURSED' THEN 4
          ELSE 5
        END,
        la.created_at DESC`,
      [payload.userId]
    )

    return NextResponse.json({ applications: result.rows || [] })
  } catch (error) {
    console.error('Error fetching loan applications:', error)
    return NextResponse.json({ applications: [] })
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

    // Check if table exists
    try {
      await query(`SELECT 1 FROM loan_applications LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ 
        error: 'Loans system is being set up. Please try again in a few minutes.',
        code: 'TABLE_NOT_READY'
      }, { status: 503 })
    }

    const data = await req.json()
    const applicationNumber = `LOAN-${Date.now().toString(36).toUpperCase()}`

    // Calculate monthly payment
    const monthlyRate = data.interest_rate / 100 / 12
    const monthlyPayment = data.amount * monthlyRate * Math.pow(1 + monthlyRate, data.term) / (Math.pow(1 + monthlyRate, data.term) - 1)
    const totalPayment = monthlyPayment * data.term
    const processingFee = data.amount * (data.processing_fee / 100)

    const result = await query(
      `INSERT INTO loan_applications (
        id, user_id, product_id, application_number,
        amount, term, purpose, interest_rate, monthly_payment, total_payment, processing_fee,
        first_name, last_name, date_of_birth, phone,
        employment_status, employer_name, job_title, years_employed,
        annual_income, other_income, existing_loans, monthly_expenses,
        documents, ip_address, user_agent, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, NOW(), NOW())
      RETURNING id, application_number`,
      [
        `loan_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        payload.userId,
        data.productId,
        applicationNumber,
        data.amount,
        data.term,
        data.purpose,
        data.interest_rate || null,
        monthlyPayment,
        totalPayment,
        processingFee,
        data.firstName,
        data.lastName,
        data.dateOfBirth,
        data.phone,
        data.employmentStatus,
        data.employerName,
        data.jobTitle,
        data.yearsEmployed,
        data.annualIncome,
        data.otherIncome || 0,
        data.existingLoans || 0,
        data.monthlyExpenses,
        data.documents ? JSON.stringify(data.documents) : null,
        req.headers.get('x-forwarded-for') || req.ip,
        req.headers.get('user-agent'),
        'PENDING'
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
          'New Loan Application',
          `A new loan application for $${data.amount} has been submitted`,
          JSON.stringify({ 
            applicationId: result.rows[0].id,
            userId: payload.userId,
            amount: data.amount,
            reference: result.rows[0].application_number
          }),
          false
        ]
      )
    } catch (notifError) {
      console.error('Failed to create admin notification:', notifError)
    }

    // Create notification for user
    try {
      await query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, data, action_url, is_read, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
          payload.userId,
          'loan',
          'Loan Application Submitted',
          `Your loan application for $${data.amount} has been submitted and is pending review.`,
          JSON.stringify({ 
            applicationId: result.rows[0].id,
            amount: data.amount,
            reference: result.rows[0].application_number
          }),
          '/dashboard/loans',
          false
        ]
      )
    } catch (notifError) {
      console.error('Failed to create user notification:', notifError)
    }

    return NextResponse.json({ 
      success: true, 
      applicationId: result.rows[0].id,
      reference: result.rows[0].application_number
    })

  } catch (error) {
    console.error('Error submitting loan application:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
