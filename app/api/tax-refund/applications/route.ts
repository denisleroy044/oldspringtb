import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

// Helper function to generate random reference
function generateReference() {
  const prefix = 'REF'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

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
      await query(`SELECT 1 FROM tax_refund_applications LIMIT 1`)
    } catch (tableError) {
      // Table doesn't exist yet, return empty array
      return NextResponse.json({ applications: [] })
    }

    const result = await query(
      `SELECT 
        id, 
        application_number as "applicationNumber",
        tax_year as "taxYear",
        filing_status as "filingStatus",
        total_income as "totalIncome",
        refund_amount as "refundAmount",
        amount_due as "amountDue",
        status,
        created_at as "createdAt",
        completed_at as "completedAt",
        expected_deposit_date as "expectedDepositDate"
       FROM tax_refund_applications
       WHERE user_id = $1
       ORDER BY 
        CASE status 
          WHEN 'DRAFT' THEN 1
          WHEN 'SUBMITTED' THEN 2
          WHEN 'UNDER_REVIEW' THEN 3
          WHEN 'APPROVED' THEN 4
          WHEN 'COMPLETED' THEN 5
          ELSE 6
        END,
        created_at DESC`,
      [payload.userId]
    )

    return NextResponse.json({ applications: result.rows || [] })
  } catch (error) {
    console.error('Error fetching tax refunds:', error)
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

    // Check if table exists, if not create it
    try {
      await query(`SELECT 1 FROM tax_refund_applications LIMIT 1`)
    } catch (tableError) {
      // Table doesn't exist, return helpful message
      return NextResponse.json({ 
        error: 'Tax refund system is being set up. Please try again in a few minutes.',
        code: 'TABLE_NOT_READY'
      }, { status: 503 })
    }

    const data = await req.json()
    const applicationNumber = `TAX-${Date.now().toString(36).toUpperCase()}`

    // Calculate tax first
    const calcRes = await fetch(`${req.nextUrl.origin}/api/tax-refund/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    const calcData = await calcRes.json()
    
    if (!calcData.success) {
      return NextResponse.json({ error: 'Tax calculation failed' }, { status: 400 })
    }

    const calc = calcData.calculation

    const result = await query(
      `INSERT INTO tax_refund_applications (
        id, user_id, application_number,
        tax_year, filing_status, dependents,
        employment_income, business_income, investment_income, other_income, total_income,
        standard_deduction, itemized_deductions, retirement_contributions,
        health_savings_contributions, charitable_contributions, student_loan_interest,
        mortgage_interest, property_taxes, state_local_taxes, total_deductions,
        child_tax_credit, child_count, education_credit, earned_income_credit,
        retirement_savings_credit, energy_credit, foreign_tax_credit, total_credits,
        federal_tax_withheld, state_tax_withheld, estimated_tax_payments,
        prior_year_credit_applied, total_payments,
        taxable_income, tax_liability, refund_amount, amount_due,
        bank_account_id, account_number_masked, routing_number,
        address_line1, address_line2, city, state, postal_code,
        documents, status, reference, ip_address, user_agent,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, NOW(), NOW())
      RETURNING id, application_number`,
      [
        `tax_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        payload.userId,
        applicationNumber,
        data.taxYear || 2024,
        data.filingStatus || 'SINGLE',
        data.dependents || 0,
        data.income?.employment || 0,
        data.income?.business || 0,
        data.income?.investment || 0,
        data.income?.other || 0,
        calc.totalIncome || 0,
        data.deductions?.useStandard !== false,
        data.deductions?.itemized || 0,
        data.deductions?.retirement || 0,
        data.deductions?.hsa || 0,
        data.deductions?.charitable || 0,
        data.deductions?.studentLoan || 0,
        data.deductions?.mortgage || 0,
        data.deductions?.propertyTax || 0,
        data.deductions?.stateLocalTax || 0,
        calc.totalDeductions || 0,
        data.credits?.childTaxCredit || false,
        data.credits?.childCount || 0,
        data.credits?.educationCredit || false,
        data.credits?.earnedIncomeCredit || false,
        data.credits?.retirementSavingsCredit || false,
        data.credits?.energyCredit || false,
        data.credits?.foreignTaxCredit || false,
        calc.totalCredits || 0,
        data.withholding?.federal || 0,
        data.withholding?.state || 0,
        data.withholding?.estimated || 0,
        data.withholding?.priorYearCredit || 0,
        calc.totalPayments || 0,
        calc.taxableIncome || 0,
        calc.taxLiability || 0,
        calc.refundAmount || 0,
        calc.amountDue || 0,
        data.bankAccountId || null,
        data.accountNumberMasked || null,
        data.routingNumber || null,
        data.address?.line1 || null,
        data.address?.line2 || null,
        data.address?.city || null,
        data.address?.state || null,
        data.address?.postalCode || null,
        data.documents ? JSON.stringify(data.documents) : null,
        'SUBMITTED',
        generateReference(),
        req.headers.get('x-forwarded-for') || req.ip || null,
        req.headers.get('user-agent') || null
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
          'tax',
          'New Tax Refund Application',
          `A new tax refund application for $${calc.refundAmount || 0} has been submitted`,
          JSON.stringify({ 
            applicationId: result.rows[0].id,
            userId: payload.userId,
            amount: calc.refundAmount || 0,
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
          'tax',
          'Tax Refund Application Submitted',
          `Your tax refund application has been submitted and is being processed.`,
          JSON.stringify({ 
            applicationId: result.rows[0].id,
            refundAmount: calc.refundAmount || 0,
            reference: result.rows[0].application_number
          }),
          '/dashboard/tax-refund',
          false
        ]
      )
    } catch (notifError) {
      console.error('Failed to create user notification:', notifError)
    }

    return NextResponse.json({ 
      success: true, 
      applicationId: result.rows[0].id,
      reference: result.rows[0].application_number,
      calculation: calc
    })

  } catch (error) {
    console.error('Error submitting tax refund:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
