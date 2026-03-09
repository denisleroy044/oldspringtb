-- ============================================
-- TAX REFUND SYSTEM
-- ============================================

-- Tax refund applications table
CREATE TABLE IF NOT EXISTS tax_refund_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_number TEXT UNIQUE NOT NULL,
  
  -- Tax Year Information
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL, -- SINGLE, MARRIED_JOINT, MARRIED_SEPARATE, HEAD_HOUSEHOLD
  dependents INTEGER DEFAULT 0,
  
  -- Income Information
  employment_income DECIMAL(10,2) DEFAULT 0,
  business_income DECIMAL(10,2) DEFAULT 0,
  investment_income DECIMAL(10,2) DEFAULT 0,
  other_income DECIMAL(10,2) DEFAULT 0,
  total_income DECIMAL(10,2) DEFAULT 0,
  
  -- Deductions
  standard_deduction BOOLEAN DEFAULT true,
  itemized_deductions DECIMAL(10,2) DEFAULT 0,
  retirement_contributions DECIMAL(10,2) DEFAULT 0,
  health_savings_contributions DECIMAL(10,2) DEFAULT 0,
  charitable_contributions DECIMAL(10,2) DEFAULT 0,
  student_loan_interest DECIMAL(10,2) DEFAULT 0,
  mortgage_interest DECIMAL(10,2) DEFAULT 0,
  property_taxes DECIMAL(10,2) DEFAULT 0,
  state_local_taxes DECIMAL(10,2) DEFAULT 0,
  total_deductions DECIMAL(10,2) DEFAULT 0,
  
  -- Tax Credits
  child_tax_credit BOOLEAN DEFAULT false,
  child_count INTEGER DEFAULT 0,
  education_credit BOOLEAN DEFAULT false,
  earned_income_credit BOOLEAN DEFAULT false,
  retirement_savings_credit BOOLEAN DEFAULT false,
  energy_credit BOOLEAN DEFAULT false,
  foreign_tax_credit BOOLEAN DEFAULT false,
  total_credits DECIMAL(10,2) DEFAULT 0,
  
  -- Tax Withholding
  federal_tax_withheld DECIMAL(10,2) DEFAULT 0,
  state_tax_withheld DECIMAL(10,2) DEFAULT 0,
  estimated_tax_payments DECIMAL(10,2) DEFAULT 0,
  prior_year_credit_applied DECIMAL(10,2) DEFAULT 0,
  total_payments DECIMAL(10,2) DEFAULT 0,
  
  -- Calculated Fields
  taxable_income DECIMAL(10,2) DEFAULT 0,
  tax_liability DECIMAL(10,2) DEFAULT 0,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  amount_due DECIMAL(10,2) DEFAULT 0,
  
  -- Bank Account for Direct Deposit
  bank_account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  account_number_masked TEXT,
  routing_number TEXT,
  
  -- Mailing Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  
  -- Documents
  documents JSONB,
  
  -- Status Tracking
  status TEXT DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, COMPLETED
  status_history JSONB[],
  admin_notes TEXT,
  
  -- Review Details
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  approved_amount DECIMAL(10,2),
  rejection_reason TEXT,
  
  -- Processing Details
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  expected_deposit_date DATE,
  
  -- Metadata
  reference TEXT UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tax documents table
CREATE TABLE IF NOT EXISTS tax_documents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id TEXT REFERENCES tax_refund_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- W2, 1099, RECEIPT, STATEMENT, etc.
  document_name TEXT,
  file_name TEXT,
  file_url TEXT,
  file_size INTEGER,
  tax_year INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- IRS tax brackets reference table
CREATE TABLE IF NOT EXISTS tax_brackets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  income_from DECIMAL(10,2) NOT NULL,
  income_to DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample tax brackets for 2024
INSERT INTO tax_brackets (tax_year, filing_status, rate, income_from, income_to) VALUES
  -- Single filers
  (2024, 'SINGLE', 10, 0, 11600),
  (2024, 'SINGLE', 12, 11601, 47150),
  (2024, 'SINGLE', 22, 47151, 100525),
  (2024, 'SINGLE', 24, 100526, 191950),
  (2024, 'SINGLE', 32, 191951, 243725),
  (2024, 'SINGLE', 35, 243726, 609350),
  (2024, 'SINGLE', 37, 609351, 999999999),
  
  -- Married filing jointly
  (2024, 'MARRIED_JOINT', 10, 0, 23200),
  (2024, 'MARRIED_JOINT', 12, 23201, 94300),
  (2024, 'MARRIED_JOINT', 22, 94301, 201050),
  (2024, 'MARRIED_JOINT', 24, 201051, 383900),
  (2024, 'MARRIED_JOINT', 32, 383901, 487450),
  (2024, 'MARRIED_JOINT', 35, 487451, 731200),
  (2024, 'MARRIED_JOINT', 37, 731201, 999999999),
  
  -- Head of household
  (2024, 'HEAD_HOUSEHOLD', 10, 0, 16550),
  (2024, 'HEAD_HOUSEHOLD', 12, 16551, 63100),
  (2024, 'HEAD_HOUSEHOLD', 22, 63101, 100500),
  (2024, 'HEAD_HOUSEHOLD', 24, 100501, 191950),
  (2024, 'HEAD_HOUSEHOLD', 32, 191951, 243700),
  (2024, 'HEAD_HOUSEHOLD', 35, 243701, 609350),
  (2024, 'HEAD_HOUSEHOLD', 37, 609351, 999999999)
ON CONFLICT DO NOTHING;

-- Standard deduction amounts
CREATE TABLE IF NOT EXISTS standard_deductions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO standard_deductions (tax_year, filing_status, amount) VALUES
  (2024, 'SINGLE', 14600),
  (2024, 'MARRIED_JOINT', 29200),
  (2024, 'MARRIED_SEPARATE', 14600),
  (2024, 'HEAD_HOUSEHOLD', 21900)
ON CONFLICT DO NOTHING;

-- ============================================
-- STATEMENTS SYSTEM
-- ============================================

-- Statements table
CREATE TABLE IF NOT EXISTS statements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  statement_number TEXT UNIQUE NOT NULL,
  
  -- Statement Type
  statement_type TEXT NOT NULL, -- MONTHLY, QUARTERLY, YEARLY, CUSTOM
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Account Information
  account_name TEXT,
  account_number_masked TEXT,
  account_type TEXT,
  currency TEXT DEFAULT 'USD',
  
  -- Balance Information
  opening_balance DECIMAL(10,2) NOT NULL,
  closing_balance DECIMAL(10,2) NOT NULL,
  average_daily_balance DECIMAL(10,2),
  
  -- Summary Totals
  total_deposits DECIMAL(10,2) DEFAULT 0,
  total_withdrawals DECIMAL(10,2) DEFAULT 0,
  total_transfers_in DECIMAL(10,2) DEFAULT 0,
  total_transfers_out DECIMAL(10,2) DEFAULT 0,
  total_fees DECIMAL(10,2) DEFAULT 0,
  total_interest_earned DECIMAL(10,2) DEFAULT 0,
  total_interest_charged DECIMAL(10,2) DEFAULT 0,
  net_change DECIMAL(10,2) DEFAULT 0,
  
  -- Transaction Summary
  transaction_count INTEGER DEFAULT 0,
  credit_transaction_count INTEGER DEFAULT 0,
  debit_transaction_count INTEGER DEFAULT 0,
  
  -- Category Breakdown
  category_breakdown JSONB,
  
  -- Charts Data
  daily_balance_data JSONB,
  spending_by_category JSONB,
  
  -- File Information
  pdf_url TEXT,
  csv_url TEXT,
  file_size INTEGER,
  
  -- Generation Details
  generated_at TIMESTAMP DEFAULT NOW(),
  generated_by TEXT,
  
  -- Status
  status TEXT DEFAULT 'GENERATED', -- GENERATED, SENT, ARCHIVED
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Statement items (detailed breakdown)
CREATE TABLE IF NOT EXISTS statement_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  statement_id TEXT REFERENCES statements(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  count INTEGER DEFAULT 1,
  percentage DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Statement transactions (linked to actual transactions)
CREATE TABLE IF NOT EXISTS statement_transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  statement_id TEXT REFERENCES statements(id) ON DELETE CASCADE,
  transaction_id TEXT REFERENCES transactions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scheduled statements (for auto-generation)
CREATE TABLE IF NOT EXISTS scheduled_statements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  schedule_type TEXT NOT NULL, -- MONTHLY, QUARTERLY, YEARLY
  day_of_month INTEGER,
  day_of_week INTEGER,
  month INTEGER,
  format TEXT DEFAULT 'PDF',
  email_enabled BOOLEAN DEFAULT false,
  email_address TEXT,
  is_active BOOLEAN DEFAULT true,
  last_generated TIMESTAMP,
  next_generation DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Statement templates
CREATE TABLE IF NOT EXISTS statement_templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  description TEXT,
  layout JSONB,
  colors JSONB,
  include_charts BOOLEAN DEFAULT true,
  include_category_breakdown BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default template
INSERT INTO statement_templates (name, description, is_default) VALUES
  ('Standard Statement', 'Standard bank statement with all details', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- INDEXES
-- ============================================

-- Tax refund indexes
CREATE INDEX IF NOT EXISTS idx_tax_applications_user ON tax_refund_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_applications_status ON tax_refund_applications(status);
CREATE INDEX IF NOT EXISTS idx_tax_applications_year ON tax_refund_applications(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_applications_number ON tax_refund_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_tax_documents_user ON tax_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_documents_application ON tax_documents(application_id);

-- Statements indexes
CREATE INDEX IF NOT EXISTS idx_statements_user ON statements(user_id);
CREATE INDEX IF NOT EXISTS idx_statements_account ON statements(account_id);
CREATE INDEX IF NOT EXISTS idx_statements_period ON statements(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_statements_type ON statements(statement_type);
CREATE INDEX IF NOT EXISTS idx_statement_items_statement ON statement_items(statement_id);
CREATE INDEX IF NOT EXISTS idx_statement_transactions_statement ON statement_transactions(statement_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_statements_user ON scheduled_statements(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_statements_next ON scheduled_statements(next_generation);

-- ============================================
-- FUNCTION TO GENERATE MONTHLY STATEMENTS
-- ============================================

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
      WHEN created_at < v_start_date THEN 
        CASE WHEN type = 'credit' THEN amount ELSE -amount END
      ELSE 0
    END
  ), 0) INTO v_opening
  FROM transactions
  WHERE "accountId" = p_account_id;
  
  -- Get period aggregates
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'credit' THEN amount END), 0),
    COALESCE(SUM(CASE WHEN type = 'debit' THEN amount END), 0),
    COUNT(*)
  INTO v_deposits, v_withdrawals, v_transaction_count
  FROM transactions
  WHERE "accountId" = p_account_id 
    AND created_at BETWEEN v_start_date AND v_end_date;
  
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
    gen_random_uuid()::TEXT, p_user_id, p_account_id, v_statement_number, 'MONTHLY',
    v_start_date, v_end_date, v_account."accountType", 
    v_account."accountNumber", v_account."accountType",
    v_opening, v_closing, v_deposits, v_withdrawals, v_transaction_count,
    NOW(), 'GENERATED', NOW(), NOW()
  ) RETURNING id INTO v_statement_id;
  
  RETURN v_statement_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE TAX REFUND APPLICATIONS FOR DEMO USER
-- ============================================

DO $$
DECLARE
  demo_user_id TEXT;
  app_id TEXT;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    -- Create a submitted application
    INSERT INTO tax_refund_applications (
      id, user_id, application_number, tax_year, filing_status, dependents,
      employment_income, business_income, investment_income, total_income,
      standard_deduction, retirement_contributions, charitable_contributions,
      federal_tax_withheld, estimated_tax_payments, total_payments,
      taxable_income, refund_amount, status, reference, created_at, updated_at
    ) VALUES (
      gen_random_uuid()::TEXT,
      demo_user_id,
      'TAX-' || to_char(NOW(), 'YYYYMMDD') || '-001',
      2024,
      'SINGLE',
      0,
      75000,
      0,
      1200,
      76200,
      true,
      6000,
      500,
      12500,
      0,
      12500,
      70200,
      1850,
      'UNDER_REVIEW',
      'REF-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)),
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '5 days'
    );
    
    -- Create an approved application (last year)
    INSERT INTO tax_refund_applications (
      id, user_id, application_number, tax_year, filing_status, dependents,
      employment_income, total_income, standard_deduction,
      federal_tax_withheld, total_payments, taxable_income,
      refund_amount, status, approved_amount, completed_at, reference,
      created_at, updated_at
    ) VALUES (
      gen_random_uuid()::TEXT,
      demo_user_id,
      'TAX-' || to_char(NOW() - INTERVAL '1 year', 'YYYYMMDD') || '-001',
      2023,
      'SINGLE',
      0,
      72000,
      72000,
      true,
      11800,
      11800,
      57400,
      2750,
      'COMPLETED',
      2750,
      NOW() - INTERVAL '3 months',
      'REF-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)),
      NOW() - INTERVAL '1 year',
      NOW() - INTERVAL '3 months'
    );
  END IF;
END $$;

-- ============================================
-- SAMPLE STATEMENTS FOR DEMO USER
-- ============================================

DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
  savings_account_id TEXT;
  v_month INTEGER;
  v_year INTEGER;
  v_statement_id TEXT;
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
      v_month := EXTRACT(MONTH FROM NOW() - (i || ' months')::INTERVAL);
      v_year := EXTRACT(YEAR FROM NOW() - (i || ' months')::INTERVAL);
      
      -- Generate for checking account
      IF checking_account_id IS NOT NULL THEN
        PERFORM generate_monthly_statement(demo_user_id, checking_account_id, v_year, v_month);
      END IF;
      
      -- Generate for savings account
      IF savings_account_id IS NOT NULL THEN
        PERFORM generate_monthly_statement(demo_user_id, savings_account_id, v_year, v_month);
      END IF;
    END LOOP;
  END IF;
END $$;

