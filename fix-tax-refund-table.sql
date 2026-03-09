-- Create tax_refund_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS tax_refund_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  application_number TEXT UNIQUE NOT NULL,
  tax_year INTEGER NOT NULL,
  filing_status TEXT NOT NULL,
  dependents INTEGER DEFAULT 0,
  employment_income DECIMAL(10,2) DEFAULT 0,
  business_income DECIMAL(10,2) DEFAULT 0,
  investment_income DECIMAL(10,2) DEFAULT 0,
  other_income DECIMAL(10,2) DEFAULT 0,
  total_income DECIMAL(10,2) DEFAULT 0,
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
  child_tax_credit BOOLEAN DEFAULT false,
  child_count INTEGER DEFAULT 0,
  education_credit BOOLEAN DEFAULT false,
  earned_income_credit BOOLEAN DEFAULT false,
  retirement_savings_credit BOOLEAN DEFAULT false,
  energy_credit BOOLEAN DEFAULT false,
  foreign_tax_credit BOOLEAN DEFAULT false,
  total_credits DECIMAL(10,2) DEFAULT 0,
  federal_tax_withheld DECIMAL(10,2) DEFAULT 0,
  state_tax_withheld DECIMAL(10,2) DEFAULT 0,
  estimated_tax_payments DECIMAL(10,2) DEFAULT 0,
  prior_year_credit_applied DECIMAL(10,2) DEFAULT 0,
  total_payments DECIMAL(10,2) DEFAULT 0,
  taxable_income DECIMAL(10,2) DEFAULT 0,
  tax_liability DECIMAL(10,2) DEFAULT 0,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  amount_due DECIMAL(10,2) DEFAULT 0,
  bank_account_id TEXT,
  account_number_masked TEXT,
  routing_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  documents JSONB,
  status TEXT DEFAULT 'DRAFT',
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  approved_amount DECIMAL(10,2),
  rejection_reason TEXT,
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  expected_deposit_date DATE,
  reference TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint if users table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    ALTER TABLE tax_refund_applications 
    ADD CONSTRAINT fk_tax_applications_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tax_applications_user ON tax_refund_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_applications_status ON tax_refund_applications(status);
CREATE INDEX IF NOT EXISTS idx_tax_applications_year ON tax_refund_applications(tax_year);

-- Insert sample data for demo user
DO $$
DECLARE
  demo_user_id TEXT;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    -- Check if demo user already has applications
    IF NOT EXISTS (SELECT 1 FROM tax_refund_applications WHERE user_id = demo_user_id) THEN
      INSERT INTO tax_refund_applications (
        id, user_id, application_number, tax_year, filing_status,
        employment_income, total_income, standard_deduction,
        federal_tax_withheld, total_payments, taxable_income,
        refund_amount, status, reference, created_at
      ) VALUES 
      (
        gen_random_uuid()::TEXT,
        demo_user_id,
        'TAX-2024-001',
        2024,
        'SINGLE',
        75000,
        75000,
        true,
        12500,
        12500,
        60400,
        1850,
        'UNDER_REVIEW',
        'REF-2024-001',
        NOW() - INTERVAL '5 days'
      ),
      (
        gen_random_uuid()::TEXT,
        demo_user_id,
        'TAX-2023-001',
        2023,
        'SINGLE',
        72000,
        72000,
        true,
        11800,
        11800,
        57400,
        2750,
        'COMPLETED',
        'REF-2023-001',
        NOW() - INTERVAL '1 year'
      );
    END IF;
  END IF;
END $$;
