# Fix the tax refund API route
cat > src/app/api/tax-refund/applications/route.ts << 'EOF'
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, NOW(), NOW())
      RETURNING id, application_number`,
      [
        `tax_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        payload.userId,
        applicationNumber,
        data.taxYear,
        data.filingStatus,
        data.dependents || 0,
        data.income?.employment || 0,
        data.income?.business || 0,
        data.income?.investment || 0,
        data.income?.other || 0,
        calc.totalIncome,
        data.deductions?.useStandard !== false,
        data.deductions?.itemized || 0,
        data.deductions?.retirement || 0,
        data.deductions?.hsa || 0,
        data.deductions?.charitable || 0,
        data.deductions?.studentLoan || 0,
        data.deductions?.mortgage || 0,
        data.deductions?.propertyTax || 0,
        data.deductions?.stateLocalTax || 0,
        calc.totalDeductions,
        data.credits?.childTaxCredit || false,
        data.credits?.childCount || 0,
        data.credits?.educationCredit || false,
        data.credits?.earnedIncomeCredit || false,
        data.credits?.retirementSavingsCredit || false,
        data.credits?.energyCredit || false,
        data.credits?.foreignTaxCredit || false,
        calc.totalCredits,
        data.withholding?.federal || 0,
        data.withholding?.state || 0,
        data.withholding?.estimated || 0,
        data.withholding?.priorYearCredit || 0,
        calc.totalPayments,
        calc.taxableIncome,
        calc.taxLiability,
        calc.refundAmount,
        calc.amountDue,
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
        req.headers.get('user-agent') || null,
        payload.userId
      ]
    )

    // Create notification for admin
    await query(
      `INSERT INTO notifications (
        id, user_id, type, title, message, data, is_read, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [
        `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        'admin',
        'tax',
        'New Tax Refund Application',
        `A new tax refund application for $${calc.refundAmount} has been submitted`,
        JSON.stringify({ 
          applicationId: result.rows[0].id,
          userId: payload.userId,
          amount: calc.refundAmount,
          reference: result.rows[0].application_number
        }),
        false
      ]
    )

    // Create notification for user
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
          refundAmount: calc.refundAmount,
          reference: result.rows[0].application_number
        }),
        '/dashboard/tax-refund',
        false
      ]
    )

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

    const result = await query(
      `SELECT 
        id, application_number as "applicationNumber",
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
    return NextResponse.json({ applications: [] }, { status: 500 })
  }
}
EOF

echo "✅ Fixed tax refund API route"

# Also fix the statements generate_monthly_statement function in SQL
cat > fix-statement-function.sql << 'EOF'
-- Drop and recreate the function with proper syntax
DROP FUNCTION IF EXISTS generate_monthly_statement(TEXT, TEXT, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION generate_monthly_statement(
  p_user_id TEXT,
  p_account_id TEXT,
  p_year INTEGER,
  p_month INTEGER
) RETURNS TEXT AS $$
DECLARE
  v_start_date DATE;
  v_end_date DATE;
  v_statement_id TEXT;
  v_account RECORD;
  v_opening DECIMAL(10,2);
  v_closing DECIMAL(10,2);
  v_deposits DECIMAL(10,2);
  v_withdrawals DECIMAL(10,2);
  v_fees DECIMAL(10,2);
  v_interest DECIMAL(10,2);
  v_transaction_count INTEGER;
  v_statement_number TEXT;
BEGIN
  -- Calculate date range
  v_start_date := MAKE_DATE(p_year, p_month, 1);
  v_end_date := (v_start_date + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- Get account details
  SELECT * INTO v_account FROM accounts WHERE id = p_account_id AND "userId" = p_user_id;
  
  -- Get opening balance (balance at start of period)
  SELECT COALESCE(SUM(
    CASE 
      WHEN type = 'credit' THEN amount ELSE -amount 
    END
  ), 0) INTO v_opening
  FROM transactions
  WHERE "accountId" = p_account_id AND created_at < v_start_date;
  
  -- Get period aggregates
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'credit' THEN amount END), 0),
    COALESCE(SUM(CASE WHEN type = 'debit' THEN amount END), 0),
    COUNT(*)
  INTO v_deposits, v_withdrawals, v_transaction_count
  FROM transactions
  WHERE "accountId" = p_account_id 
    AND created_at >= v_start_date 
    AND created_at <= v_end_date;
  
  -- Calculate closing balance
  v_closing := v_opening + v_deposits - v_withdrawals;
  
  -- Generate statement number
  v_statement_number := 'STM-' || p_year || '-' || LPAD(p_month::TEXT, 2, '0') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  
  -- Insert statement
  INSERT INTO statements (
    id, user_id, account_id, statement_number, statement_type,
    period_start, period_end, account_name, account_number_masked,
    account_type, opening_balance, closing_balance,
    total_deposits, total_withdrawals, transaction_count,
    generated_at, status, created_at, updated_at
  ) VALUES (
    gen_random_uuid()::TEXT, 
    p_user_id, 
    p_account_id, 
    v_statement_number, 
    'MONTHLY',
    v_start_date, 
    v_end_date, 
    v_account."accountType", 
    v_account."accountNumber", 
    v_account."accountType",
    v_opening, 
    v_closing, 
    v_deposits, 
    v_withdrawals, 
    v_transaction_count,
    NOW(), 
    'GENERATED', 
    NOW(), 
    NOW()
  ) RETURNING id INTO v_statement_id;
  
  RETURN v_statement_id;
END;
$$ LANGUAGE plpgsql;

-- Create sample statements for demo user if they exist
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
  savings_account_id TEXT;
  v_month INTEGER;
  v_year INTEGER;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    -- Get demo user's accounts
    SELECT id INTO checking_account_id FROM accounts 
    WHERE "userId" = demo_user_id AND "accountType" = 'CHECKING' LIMIT 1;
    
    SELECT id INTO savings_account_id FROM accounts 
    WHERE "userId" = demo_user_id AND "accountType" = 'SAVINGS' LIMIT 1;
    
    -- Generate statements for last 3 months
    FOR i IN 0..2 LOOP
      v_month := EXTRACT(MONTH FROM (CURRENT_DATE - (i || ' months')::INTERVAL));
      v_year := EXTRACT(YEAR FROM (CURRENT_DATE - (i || ' months')::INTERVAL));
      
      -- Generate for checking account
      IF checking_account_id IS NOT NULL THEN
        BEGIN
          PERFORM generate_monthly_statement(demo_user_id, checking_account_id, v_year, v_month);
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not generate statement for checking account: %', SQLERRM;
        END;
      END IF;
      
      -- Generate for savings account
      IF savings_account_id IS NOT NULL THEN
        BEGIN
          PERFORM generate_monthly_statement(demo_user_id, savings_account_id, v_year, v_month);
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not generate statement for savings account: %', SQLERRM;
        END;
      END IF;
    END LOOP;
  END IF;
END $$;
EOF

echo "✅ Created fix-statement-function.sql"
echo ""
echo "To fix the issues:"
echo "1. Run the SQL in fix-statement-function.sql in your Neon console"
echo "2. The tax refund API has been fixed with proper JavaScript reference generator"
echo ""
echo "Run: npm run dev to restart your server"