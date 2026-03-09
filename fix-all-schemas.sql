-- ============================================
-- FIX NOTIFICATIONS TABLE
-- ============================================

-- Drop and recreate notifications table with correct schema
DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key if users table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    ALTER TABLE notifications 
    ADD CONSTRAINT fk_notifications_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Add sample notifications for demo user
DO $$
DECLARE
  demo_user_id TEXT;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at, updated_at) VALUES
    (gen_random_uuid()::TEXT, demo_user_id, 'system', 'Welcome to Oldspring Trust', 'Your account has been successfully created. Start exploring our banking services!', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    (gen_random_uuid()::TEXT, demo_user_id, 'deposit', 'Deposit Confirmed', 'Your deposit of $5,000.00 has been processed successfully.', true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    (gen_random_uuid()::TEXT, demo_user_id, 'security', 'Security Tip', 'Enable two-factor authentication for enhanced account security.', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    (gen_random_uuid()::TEXT, demo_user_id, 'loan', 'Loan Pre-approval', 'You have been pre-approved for a personal loan up to $50,000. Check your offers now!', false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
    (gen_random_uuid()::TEXT, demo_user_id, 'grant', 'Grant Opportunity', 'A new small business grant is available. Apply before the deadline.', false, NOW(), NOW());
  END IF;
END $$;

-- ============================================
-- FIX TAX REFUND APPLICATIONS TABLE
-- ============================================

-- Drop and recreate tax_refund_applications if it exists with issues
DROP TABLE IF EXISTS tax_refund_applications CASCADE;

CREATE TABLE tax_refund_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_number TEXT UNIQUE NOT NULL,
  
  -- Tax Year Information
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL,
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
  
  -- Bank Account
  bank_account_id TEXT,
  account_number_masked TEXT,
  routing_number TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  
  -- Documents
  documents JSONB,
  
  -- Status
  status TEXT DEFAULT 'DRAFT',
  status_history JSONB[],
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  approved_amount DECIMAL(10,2),
  rejection_reason TEXT,
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  expected_deposit_date DATE,
  
  -- Metadata
  reference TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tax_applications_user ON tax_refund_applications(user_id);
CREATE INDEX idx_tax_applications_status ON tax_refund_applications(status);
CREATE INDEX idx_tax_applications_year ON tax_refund_applications(tax_year);

-- ============================================
-- FIX STATEMENTS FUNCTION
-- ============================================

-- Drop and recreate the function
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
      WHEN type = 'credit' THEN amount 
      WHEN type = 'debit' THEN -amount 
      ELSE 0
    END
  ), 0) INTO v_opening
  FROM transactions
  WHERE "accountId" = p_account_id AND DATE(created_at) < v_start_date;
  
  -- Get period aggregates
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'credit' THEN amount END), 0),
    COALESCE(SUM(CASE WHEN type = 'debit' THEN amount END), 0),
    COUNT(*)
  INTO v_deposits, v_withdrawals, v_transaction_count
  FROM transactions
  WHERE "accountId" = p_account_id 
    AND DATE(created_at) >= v_start_date 
    AND DATE(created_at) <= v_end_date;
  
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
    COALESCE(v_account."accountType", 'Account'), 
    COALESCE(v_account."accountNumber", '****'),
    COALESCE(v_account."accountType", 'UNKNOWN'),
    COALESCE(v_opening, 0), 
    COALESCE(v_closing, 0), 
    COALESCE(v_deposits, 0), 
    COALESCE(v_withdrawals, 0), 
    COALESCE(v_transaction_count, 0),
    NOW(), 
    'GENERATED', 
    NOW(), 
    NOW()
  ) RETURNING id INTO v_statement_id;
  
  RETURN v_statement_id;
END;
$$ LANGUAGE plpgsql;

-- Create statements table if it doesn't exist
CREATE TABLE IF NOT EXISTS statements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  statement_number TEXT UNIQUE NOT NULL,
  statement_type TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  account_name TEXT,
  account_number_masked TEXT,
  account_type TEXT,
  opening_balance DECIMAL(10,2) NOT NULL,
  closing_balance DECIMAL(10,2) NOT NULL,
  total_deposits DECIMAL(10,2) DEFAULT 0,
  total_withdrawals DECIMAL(10,2) DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  generated_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'GENERATED',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_statements_user ON statements(user_id);
CREATE INDEX idx_statements_account ON statements(account_id);
CREATE INDEX idx_statements_period ON statements(period_start, period_end);

