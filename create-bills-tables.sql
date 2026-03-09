-- ============================================
-- BILLS SYSTEM TABLES
-- ============================================

-- Bill categories table
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
  user_id TEXT NOT NULL,
  category_id TEXT REFERENCES bill_categories(id),
  bill_name TEXT NOT NULL,
  bill_number TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  due_date DATE NOT NULL,
  recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT,
  auto_pay BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'PENDING',
  payment_reference TEXT,
  paid_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bill payment requests (for admin approval)
CREATE TABLE IF NOT EXISTS bill_payment_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  bill_id TEXT REFERENCES bills(id) ON DELETE CASCADE,
  account_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'BANK',
  admin_notes TEXT,
  status TEXT DEFAULT 'PENDING',
  approved_by TEXT,
  approved_at TIMESTAMP,
  processed_at TIMESTAMP,
  transaction_id TEXT,
  reference TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraints
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    ALTER TABLE bills ADD CONSTRAINT fk_bills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    ALTER TABLE bill_payment_requests ADD CONSTRAINT fk_bill_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounts') THEN
    ALTER TABLE bill_payment_requests ADD CONSTRAINT fk_bill_requests_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bills_user ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date);
CREATE INDEX IF NOT EXISTS idx_bill_requests_user ON bill_payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_bill_requests_status ON bill_payment_requests(status);

-- Insert sample bills for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  utilities_id TEXT;
  rent_id TEXT;
  subscription_id TEXT;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get category IDs
  SELECT id INTO utilities_id FROM bill_categories WHERE name = 'Utilities' LIMIT 1;
  SELECT id INTO rent_id FROM bill_categories WHERE name = 'Rent' LIMIT 1;
  SELECT id INTO subscription_id FROM bill_categories WHERE name = 'Subscription' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    -- Check if demo user already has bills
    IF NOT EXISTS (SELECT 1 FROM bills WHERE user_id = demo_user_id) THEN
      -- Insert sample bills
      INSERT INTO bills (id, user_id, category_id, bill_name, bill_number, amount, due_date, recurring, status, created_at, updated_at) VALUES
      (gen_random_uuid()::TEXT, demo_user_id, utilities_id, 'Electricity Bill', 'ELEC-12345', 145.50, CURRENT_DATE + INTERVAL '5 days', false, 'PENDING', NOW(), NOW()),
      (gen_random_uuid()::TEXT, demo_user_id, utilities_id, 'Water Bill', 'WATER-789', 85.20, CURRENT_DATE + INTERVAL '10 days', false, 'PENDING', NOW(), NOW()),
      (gen_random_uuid()::TEXT, demo_user_id, rent_id, 'Monthly Rent', 'APT-4B', 1500.00, CURRENT_DATE + INTERVAL '2 days', true, 'PENDING', NOW(), NOW()),
      (gen_random_uuid()::TEXT, demo_user_id, subscription_id, 'Netflix', 'SUB-555', 15.99, CURRENT_DATE + INTERVAL '15 days', true, 'PENDING', NOW(), NOW()),
      (gen_random_uuid()::TEXT, demo_user_id, subscription_id, 'Spotify', 'SUB-777', 9.99, CURRENT_DATE + INTERVAL '20 days', true, 'PENDING', NOW(), NOW()),
      (gen_random_uuid()::TEXT, demo_user_id, utilities_id, 'Internet Bill', 'ISP-9876', 89.99, CURRENT_DATE - INTERVAL '2 days', false, 'OVERDUE', NOW(), NOW());
    END IF;
  END IF;
END $$;
