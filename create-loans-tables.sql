-- ============================================
-- LOANS SYSTEM TABLES
-- ============================================

-- Loan products table
CREATE TABLE IF NOT EXISTS loan_products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  min_amount DECIMAL(10,2) NOT NULL,
  max_amount DECIMAL(10,2) NOT NULL,
  min_term INTEGER NOT NULL,
  max_term INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  processing_fee DECIMAL(5,2) DEFAULT 0,
  credit_score_min INTEGER DEFAULT 600,
  income_multiplier DECIMAL(3,2) DEFAULT 3.0,
  requirements TEXT[],
  documents_required TEXT[],
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default loan products
INSERT INTO loan_products (name, description, category, min_amount, max_amount, min_term, max_term, interest_rate, processing_fee, credit_score_min, features) VALUES
  ('Personal Loan', 'Flexible personal loans for any purpose', 'personal', 1000, 50000, 6, 60, 8.5, 1.0, 640, ARRAY['No collateral', 'Fixed payments', 'Quick funding']),
  ('Business Loan', 'Loans to grow your business', 'business', 5000, 250000, 12, 84, 7.5, 1.5, 680, ARRAY['Fast approval', 'Flexible terms', 'Dedicated manager']),
  ('Mortgage', 'Home purchase or refinance', 'mortgage', 50000, 1000000, 60, 360, 4.5, 2.0, 700, ARRAY['30-year fixed', 'Rate lock', 'First-time buyer']),
  ('Auto Loan', 'Finance your vehicle purchase', 'auto', 5000, 100000, 12, 72, 6.5, 1.0, 620, ARRAY['New & used', 'Refinance', 'Quick approval']),
  ('Education Loan', 'Fund your education', 'education', 2000, 100000, 6, 120, 5.5, 0.5, 600, ARRAY['Deferred payment', 'Grace period', 'Co-signer release'])
ON CONFLICT DO NOTHING;

-- Loan offers table
CREATE TABLE IF NOT EXISTS loan_offers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  product_id TEXT REFERENCES loan_products(id),
  offer_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  term INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  monthly_payment DECIMAL(10,2),
  total_interest DECIMAL(10,2),
  total_payment DECIMAL(10,2),
  processing_fee DECIMAL(10,2),
  expiry_date DATE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'PENDING',
  viewed_at TIMESTAMP,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Loan applications table
CREATE TABLE IF NOT EXISTS loan_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  product_id TEXT REFERENCES loan_products(id),
  offer_id TEXT REFERENCES loan_offers(id),
  application_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  term INTEGER NOT NULL,
  purpose TEXT,
  interest_rate DECIMAL(5,2),
  monthly_payment DECIMAL(10,2),
  total_payment DECIMAL(10,2),
  processing_fee DECIMAL(10,2),
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  employment_status TEXT,
  employer_name TEXT,
  job_title TEXT,
  years_employed INTEGER,
  annual_income DECIMAL(10,2),
  other_income DECIMAL(10,2),
  existing_loans DECIMAL(10,2) DEFAULT 0,
  monthly_expenses DECIMAL(10,2),
  documents JSONB,
  status TEXT DEFAULT 'PENDING',
  status_history JSONB[],
  admin_notes TEXT,
  approved_by TEXT,
  approved_at TIMESTAMP,
  approved_amount DECIMAL(10,2),
  approved_term INTEGER,
  approved_interest_rate DECIMAL(5,2),
  disbursed_at TIMESTAMP,
  disbursed_to_account TEXT,
  reference TEXT UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraints
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    ALTER TABLE loan_offers ADD CONSTRAINT fk_loan_offers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    ALTER TABLE loan_applications ADD CONSTRAINT fk_loan_applications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_loan_products_category ON loan_products(category);
CREATE INDEX IF NOT EXISTS idx_loan_offers_user ON loan_offers(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_offers_status ON loan_offers(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_user ON loan_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_number ON loan_applications(application_number);

-- Insert sample offers for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  personal_loan_id TEXT;
  business_loan_id TEXT;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get loan product IDs
  SELECT id INTO personal_loan_id FROM loan_products WHERE name = 'Personal Loan' LIMIT 1;
  SELECT id INTO business_loan_id FROM loan_products WHERE name = 'Business Loan' LIMIT 1;
  
  IF demo_user_id IS NOT NULL AND personal_loan_id IS NOT NULL THEN
    -- Check if demo user already has offers
    IF NOT EXISTS (SELECT 1 FROM loan_offers WHERE user_id = demo_user_id) THEN
      -- Insert sample offers
      INSERT INTO loan_offers (id, user_id, product_id, offer_name, amount, term, interest_rate, monthly_payment, total_interest, total_payment, processing_fee, expiry_date, message, status, created_at) VALUES
      (gen_random_uuid()::TEXT, demo_user_id, personal_loan_id, 'Special Personal Loan Offer', 15000, 36, 7.99, 469.77, 1911.72, 16911.72, 150.00, NOW() + INTERVAL '30 days', 'Based on your excellent credit history, we are pleased to offer you this pre-approved personal loan.', 'PENDING', NOW() - INTERVAL '2 days'),
      (gen_random_uuid()::TEXT, demo_user_id, business_loan_id, 'Business Growth Offer', 50000, 60, 6.99, 989.93, 9395.80, 59395.80, 500.00, NOW() + INTERVAL '30 days', 'Congratulations! Your business qualifies for this special growth funding offer.', 'PENDING', NOW() - INTERVAL '2 days');
    END IF;
  END IF;
END $$;

-- Insert sample applications for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  personal_loan_id TEXT;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get loan product ID
  SELECT id INTO personal_loan_id FROM loan_products WHERE name = 'Personal Loan' LIMIT 1;
  
  IF demo_user_id IS NOT NULL AND personal_loan_id IS NOT NULL THEN
    -- Check if demo user already has applications
    IF NOT EXISTS (SELECT 1 FROM loan_applications WHERE user_id = demo_user_id) THEN
      -- Insert sample applications
      INSERT INTO loan_applications (id, user_id, product_id, application_number, amount, term, purpose, interest_rate, monthly_payment, total_payment, processing_fee, first_name, last_name, employment_status, annual_income, status, reference, created_at) VALUES
      (gen_random_uuid()::TEXT, demo_user_id, personal_loan_id, 'LOAN-2024-001', 10000, 24, 'Home improvement', 8.5, 453.54, 10884.96, 100.00, 'James', 'Donaldson', 'EMPLOYED', 75000, 'UNDER_REVIEW', 'REF-LOAN-001', NOW() - INTERVAL '5 days'),
      (gen_random_uuid()::TEXT, demo_user_id, personal_loan_id, 'LOAN-2023-001', 5000, 12, 'Debt consolidation', 8.5, 435.82, 5229.84, 50.00, 'James', 'Donaldson', 'EMPLOYED', 75000, 'APPROVED', 'REF-LOAN-002', NOW() - INTERVAL '6 months');
    END IF;
  END IF;
END $$;
