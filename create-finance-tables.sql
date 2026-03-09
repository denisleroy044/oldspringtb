-- ============================================
-- BILLS SYSTEM
-- ============================================

-- Bill payees/categories table
CREATE TABLE IF NOT EXISTS bill_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default bill categories
INSERT INTO bill_categories (name, icon, description) VALUES
  ('Utilities', 'zap', 'Electricity, water, gas bills'),
  ('Telecom', 'phone', 'Phone, internet, cable TV'),
  ('Rent', 'home', 'Rent payments'),
  ('Insurance', 'shield', 'Insurance premiums'),
  ('Subscription', 'repeat', 'Monthly subscriptions'),
  ('Credit Card', 'credit-card', 'Credit card payments'),
  ('Loan', 'landmark', 'Loan repayments'),
  ('Other', 'more-horizontal', 'Other bills')
ON CONFLICT (name) DO NOTHING;

-- Bills table
CREATE TABLE IF NOT EXISTS bills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  category_id TEXT REFERENCES bill_categories(id),
  bill_name TEXT NOT NULL,
  bill_number TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  due_date DATE NOT NULL,
  recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT, -- monthly, quarterly, yearly
  auto_pay BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'PENDING', -- PENDING, PAID, OVERDUE, CANCELLED
  payment_reference TEXT,
  paid_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bill payment requests (for admin approval)
CREATE TABLE IF NOT EXISTS bill_payment_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bill_id TEXT REFERENCES bills(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'BANK',
  admin_notes TEXT,
  status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, PROCESSED
  approved_by TEXT,
  approved_at TIMESTAMP,
  processed_at TIMESTAMP,
  transaction_id TEXT,
  reference TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- LOANS SYSTEM
-- ============================================

-- Loan products table (admin configurable)
CREATE TABLE IF NOT EXISTS loan_products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  description TEXT,
  min_amount DECIMAL(10,2) NOT NULL,
  max_amount DECIMAL(10,2) NOT NULL,
  min_term INTEGER NOT NULL, -- in months
  max_term INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  processing_fee DECIMAL(5,2) DEFAULT 0,
  requirements TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default loan products
INSERT INTO loan_products (name, description, min_amount, max_amount, min_term, max_term, interest_rate, processing_fee, requirements) VALUES
  ('Personal Loan', 'Flexible personal loans for any purpose', 1000, 50000, 6, 60, 8.5, 1, ARRAY['Valid ID', 'Proof of Income', 'Bank Statements']),
  ('Business Loan', 'Loans to grow your business', 5000, 250000, 12, 84, 7.5, 1.5, ARRAY['Business Registration', 'Tax Returns', 'Financial Statements']),
  ('Mortgage', 'Home purchase or refinance', 50000, 1000000, 60, 360, 4.5, 2, ARRAY['Property Documents', 'Income Proof', 'Credit Check']),
  ('Auto Loan', 'Finance your vehicle purchase', 5000, 100000, 12, 72, 6.5, 1, ARRAY['Vehicle Details', 'Insurance', 'Income Proof']),
  ('Education Loan', 'Fund your education', 2000, 100000, 6, 120, 5.5, 0.5, ARRAY['Admission Proof', 'Fee Structure', 'ID Proof']),
  ('Debt Consolidation', 'Combine multiple debts into one', 5000, 100000, 12, 84, 9.0, 1, ARRAY['Debt Statements', 'Income Proof', 'Credit Report'])
ON CONFLICT DO NOTHING;

-- Loan offers (admin can create offers for specific users)
CREATE TABLE IF NOT EXISTS loan_offers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES loan_products(id),
  amount DECIMAL(10,2) NOT NULL,
  term INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  monthly_payment DECIMAL(10,2),
  total_interest DECIMAL(10,2),
  total_payment DECIMAL(10,2),
  expiry_date DATE,
  status TEXT DEFAULT 'PENDING', -- PENDING, ACCEPTED, DECLINED, EXPIRED
  created_by TEXT, -- admin user id
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Loan applications
CREATE TABLE IF NOT EXISTS loan_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES loan_products(id),
  offer_id TEXT REFERENCES loan_offers(id),
  amount DECIMAL(10,2) NOT NULL,
  term INTEGER NOT NULL,
  purpose TEXT,
  employment_status TEXT,
  annual_income DECIMAL(10,2),
  existing_loans DECIMAL(10,2) DEFAULT 0,
  credit_score INTEGER,
  documents JSONB,
  status TEXT DEFAULT 'PENDING', -- PENDING, UNDER_REVIEW, APPROVED, REJECTED, DISBURSED
  admin_notes TEXT,
  approved_by TEXT,
  approved_at TIMESTAMP,
  disbursed_at TIMESTAMP,
  reference TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Loan repayment schedule
CREATE TABLE IF NOT EXISTS loan_repayments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  loan_id TEXT REFERENCES loan_applications(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  principal DECIMAL(10,2),
  interest DECIMAL(10,2),
  paid_amount DECIMAL(10,2) DEFAULT 0,
  paid_date DATE,
  status TEXT DEFAULT 'PENDING', -- PENDING, PAID, OVERDUE
  transaction_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- GRANTS SYSTEM
-- ============================================

-- Grant categories (admin configurable)
CREATE TABLE IF NOT EXISTS grant_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default grant categories
INSERT INTO grant_categories (name, description, icon, color) VALUES
  ('Business', 'Grants for startups and small businesses', 'briefcase', 'blue'),
  ('Education', 'Educational grants and scholarships', 'graduation-cap', 'green'),
  ('Research', 'Research and development grants', 'flask', 'purple'),
  ('Arts & Culture', 'Grants for artists and cultural projects', 'palette', 'pink'),
  ('Non-Profit', 'Grants for non-profit organizations', 'heart', 'red'),
  ('Technology', 'Tech innovation and development grants', 'cpu', 'indigo'),
  ('Healthcare', 'Medical and healthcare research grants', 'activity', 'teal'),
  ('Environment', 'Environmental conservation grants', 'leaf', 'emerald'),
  ('Community', 'Community development grants', 'users', 'orange'),
  ('Women', 'Grants for women entrepreneurs', 'venus', 'rose')
ON CONFLICT (name) DO NOTHING;

-- Grants table (admin publishes available grants)
CREATE TABLE IF NOT EXISTS grants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  category_id TEXT REFERENCES grant_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  provider TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  eligibility_criteria TEXT[],
  requirements TEXT[],
  documents_required TEXT[],
  deadline DATE,
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, CLOSED, DRAFT
  featured BOOLEAN DEFAULT false,
  application_count INTEGER DEFAULT 0,
  created_by TEXT, -- admin user id
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Grant applications
CREATE TABLE IF NOT EXISTS grant_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grant_id TEXT REFERENCES grants(id) ON DELETE CASCADE,
  organization_name TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  project_title TEXT,
  project_description TEXT,
  requested_amount DECIMAL(10,2) NOT NULL,
  documents JSONB,
  additional_info JSONB,
  status TEXT DEFAULT 'PENDING', -- PENDING, UNDER_REVIEW, APPROVED, REJECTED
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  approved_amount DECIMAL(10,2),
  reference TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TAX REFUND SYSTEM
-- ============================================

-- Tax refund applications
CREATE TABLE IF NOT EXISTS tax_refund_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tax_year INTEGER NOT NULL,
  filing_status TEXT, -- SINGLE, MARRIED_JOINT, MARRIED_SEPARATE, HEAD_HOUSEHOLD
  income DECIMAL(10,2),
  tax_paid DECIMAL(10,2),
  refund_amount DECIMAL(10,2),
  documents JSONB,
  bank_account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSING, APPROVED, REJECTED, COMPLETED
  admin_notes TEXT,
  processed_by TEXT,
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  reference TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tax documents
CREATE TABLE IF NOT EXISTS tax_documents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id TEXT REFERENCES tax_refund_applications(id) ON DELETE CASCADE,
  document_type TEXT, -- W2, 1099, RECEIPT, etc.
  document_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STATEMENTS SYSTEM
-- ============================================

-- Account statements
CREATE TABLE IF NOT EXISTS statements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  statement_type TEXT, -- MONTHLY, QUARTERLY, YEARLY, CUSTOM
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  opening_balance DECIMAL(10,2) NOT NULL,
  closing_balance DECIMAL(10,2) NOT NULL,
  total_deposits DECIMAL(10,2) DEFAULT 0,
  total_withdrawals DECIMAL(10,2) DEFAULT 0,
  total_fees DECIMAL(10,2) DEFAULT 0,
  total_interest DECIMAL(10,2) DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  pdf_url TEXT,
  status TEXT DEFAULT 'GENERATED',
  generated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Statement items (summary of transactions)
CREATE TABLE IF NOT EXISTS statement_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  statement_id TEXT REFERENCES statements(id) ON DELETE CASCADE,
  category TEXT,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Bills indexes
CREATE INDEX IF NOT EXISTS idx_bills_user ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date);
CREATE INDEX IF NOT EXISTS idx_bill_requests_user ON bill_payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_bill_requests_status ON bill_payment_requests(status);

-- Loans indexes
CREATE INDEX IF NOT EXISTS idx_loan_offers_user ON loan_offers(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_user ON loan_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_repayments_loan ON loan_repayments(loan_id);
CREATE INDEX IF NOT EXISTS idx_loan_repayments_due ON loan_repayments(due_date);

-- Grants indexes
CREATE INDEX IF NOT EXISTS idx_grants_category ON grants(category_id);
CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_deadline ON grants(deadline);
CREATE INDEX IF NOT EXISTS idx_grant_applications_user ON grant_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_grant_applications_status ON grant_applications(status);

-- Tax refund indexes
CREATE INDEX IF NOT EXISTS idx_tax_applications_user ON tax_refund_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_applications_status ON tax_refund_applications(status);
CREATE INDEX IF NOT EXISTS idx_tax_applications_year ON tax_refund_applications(tax_year);

-- Statements indexes
CREATE INDEX IF NOT EXISTS idx_statements_user ON statements(user_id);
CREATE INDEX IF NOT EXISTS idx_statements_account ON statements(account_id);
CREATE INDEX IF NOT EXISTS idx_statements_period ON statements(period_start, period_end);

-- ============================================
-- SAMPLE DATA FOR GRANTS (SEEDED)
-- ============================================

-- Insert sample grants
DO $$
DECLARE
  business_id TEXT;
  education_id TEXT;
  research_id TEXT;
  tech_id TEXT;
BEGIN
  -- Get category IDs
  SELECT id INTO business_id FROM grant_categories WHERE name = 'Business' LIMIT 1;
  SELECT id INTO education_id FROM grant_categories WHERE name = 'Education' LIMIT 1;
  SELECT id INTO research_id FROM grant_categories WHERE name = 'Research' LIMIT 1;
  SELECT id INTO tech_id FROM grant_categories WHERE name = 'Technology' LIMIT 1;

  -- Insert grants if they don't exist
  IF NOT EXISTS (SELECT 1 FROM grants WHERE title = 'Small Business Innovation Grant') THEN
    INSERT INTO grants (category_id, title, description, provider, amount, eligibility_criteria, requirements, documents_required, deadline, featured) VALUES
    (business_id, 'Small Business Innovation Grant', 'Funding for innovative small businesses with high growth potential', 'SBA', 50000, 
     ARRAY['Registered business for at least 1 year', 'Less than 50 employees', 'Revenue under $5M'],
     ARRAY['Business Plan', 'Financial Projections', 'Innovation Statement'],
     ARRAY['Business Registration', 'Tax Returns', 'Bank Statements'],
     NOW() + INTERVAL '60 days', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM grants WHERE title = 'STEM Education Grant') THEN
    INSERT INTO grants (category_id, title, description, provider, amount, eligibility_criteria, requirements, documents_required, deadline, featured) VALUES
    (education_id, 'STEM Education Grant', 'Supporting STEM education initiatives and programs', 'NSF', 25000,
     ARRAY['Educational institution', 'Non-profit status', 'STEM-focused program'],
     ARRAY['Program Proposal', 'Budget Breakdown', 'Impact Assessment'],
     ARRAY['501c3 Certificate', 'Program Details', 'Staff Credentials'],
     NOW() + INTERVAL '45 days', true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM grants WHERE title = 'Climate Research Grant') THEN
    INSERT INTO grants (category_id, title, description, provider, amount, eligibility_criteria, requirements, documents_required, deadline) VALUES
    (research_id, 'Climate Research Grant', 'Funding for climate change and environmental research', 'Environmental Foundation', 75000,
     ARRAY['Research institution', 'PhD required', 'Published research'],
     ARRAY['Research Proposal', 'Methodology', 'Timeline'],
     ARRAY['CV', 'Publications', 'Ethics Approval'],
     NOW() + INTERVAL '90 days');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM grants WHERE title = 'Women in Tech Grant') THEN
    INSERT INTO grants (category_id, title, description, provider, amount, eligibility_criteria, requirements, documents_required, deadline, featured) VALUES
    (tech_id, 'Women in Tech Grant', 'Empowering women entrepreneurs in technology', 'Tech Forward', 35000,
     ARRAY['Women-owned business', 'Tech-focused', 'Operating for 6+ months'],
     ARRAY['Business Plan', 'Tech Demo', 'Team Background'],
     ARRAY['ID Proof', 'Business License', 'Product Demo'],
     NOW() + INTERVAL '30 days', true);
  END IF;
END $$;

-- Create function to generate statement periods
CREATE OR REPLACE FUNCTION generate_statements_for_user(p_user_id TEXT, p_account_id TEXT)
RETURNS void AS $$
DECLARE
  v_start_date DATE;
  v_end_date DATE;
  v_opening DECIMAL(10,2);
  v_closing DECIMAL(10,2);
  v_deposits DECIMAL(10,2);
  v_withdrawals DECIMAL(10,2);
BEGIN
  -- Generate last 12 months of statements
  FOR i IN 0..11 LOOP
    v_end_date := DATE_TRUNC('month', NOW())::DATE - (i * INTERVAL '1 month');
    v_start_date := v_end_date - INTERVAL '1 month' + INTERVAL '1 day';
    
    -- Check if statement already exists
    IF NOT EXISTS (SELECT 1 FROM statements WHERE account_id = p_account_id AND period_start = v_start_date) THEN
      -- Calculate aggregates
      SELECT COALESCE(SUM(CASE WHEN type = 'credit' THEN amount END), 0),
             COALESCE(SUM(CASE WHEN type = 'debit' THEN amount END), 0)
      INTO v_deposits, v_withdrawals
      FROM transactions 
      WHERE "accountId" = p_account_id 
        AND DATE(created_at) BETWEEN v_start_date AND v_end_date;
      
      -- Get opening balance (simplified - you'd need actual balance calculation)
      v_opening := 5000 + (i * 100);
      v_closing := v_opening + v_deposits - v_withdrawals;
      
      -- Insert statement
      INSERT INTO statements (
        id, user_id, account_id, statement_type, period_start, period_end,
        opening_balance, closing_balance, total_deposits, total_withdrawals,
        transaction_count, generated_at, created_at, updated_at
      ) VALUES (
        gen_random_uuid()::TEXT, p_user_id, p_account_id, 'MONTHLY',
        v_start_date, v_end_date, v_opening, v_closing,
        v_deposits, v_withdrawals,
        (SELECT COUNT(*) FROM transactions WHERE "accountId" = p_account_id AND DATE(created_at) BETWEEN v_start_date AND v_end_date),
        NOW(), NOW(), NOW()
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

