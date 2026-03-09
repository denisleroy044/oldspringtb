-- ============================================
-- CREATE SAVINGS TABLES
-- ============================================

-- Savings table
CREATE TABLE IF NOT EXISTS savings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  account_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'active',
  progress DECIMAL(5,2) DEFAULT 0,
  auto_save BOOLEAN DEFAULT false,
  auto_save_amount DECIMAL(10,2),
  auto_save_frequency TEXT,
  auto_save_day INTEGER,
  icon TEXT DEFAULT 'PiggyBank',
  color TEXT DEFAULT '#10b981',
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Savings contributions table
CREATE TABLE IF NOT EXISTS savings_contributions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  savings_id TEXT REFERENCES savings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  from_account_id TEXT,
  transaction_id TEXT,
  notes TEXT,
  contributed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Savings templates table
CREATE TABLE IF NOT EXISTS savings_templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  description TEXT,
  default_target_amount DECIMAL(10,2),
  default_priority TEXT DEFAULT 'medium',
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE savings 
ADD CONSTRAINT fk_savings_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE savings 
ADD CONSTRAINT fk_savings_account 
FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_savings_user ON savings(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_status ON savings(status);
CREATE INDEX IF NOT EXISTS idx_savings_target_date ON savings(target_date);
CREATE INDEX IF NOT EXISTS idx_savings_contributions_savings ON savings_contributions(savings_id);

-- Insert default savings templates
INSERT INTO savings_templates (name, description, default_target_amount, icon, color) VALUES
  ('Emergency Fund', 'Save for unexpected expenses', 10000, 'Shield', '#ef4444'),
  ('Vacation', 'Save for your dream vacation', 5000, 'Plane', '#3b82f6'),
  ('New Car', 'Save for a vehicle purchase', 25000, 'Car', '#10b981'),
  ('Home Down Payment', 'Save for your first home', 50000, 'Home', '#8b5cf6'),
  ('Wedding', 'Save for your special day', 15000, 'Heart', '#ec4899'),
  ('Education', 'Save for school or courses', 10000, 'GraduationCap', '#f97316'),
  ('Retirement', 'Save for retirement', 100000, 'Umbrella', '#6366f1'),
  ('New Phone', 'Save for the latest gadget', 1000, 'Smartphone', '#14b8a6'),
  ('Christmas Gifts', 'Save for holiday shopping', 2000, 'Gift', '#ef4444'),
  ('Home Renovation', 'Save for home improvements', 15000, 'Wrench', '#8b4513')
ON CONFLICT DO NOTHING;

-- Insert sample savings for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
  v_savings_id TEXT;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get demo user's checking account
  SELECT id INTO checking_account_id FROM accounts 
  WHERE "userId" = demo_user_id AND "accountType" = 'CHECKING' LIMIT 1;
  
  IF demo_user_id IS NOT NULL AND checking_account_id IS NOT NULL THEN
    -- Clear existing savings
    DELETE FROM savings WHERE user_id = demo_user_id;
    
    -- Insert sample savings
    INSERT INTO savings (id, user_id, account_id, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color, auto_save, auto_save_amount, auto_save_frequency, auto_save_day)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'Emergency Fund', 
      'Save for unexpected expenses',
      10000, 
      3500, 
      CURRENT_DATE - INTERVAL '30 days', 
      CURRENT_DATE + INTERVAL '150 days', 
      'high', 
      'active', 
      35.00,
      'Shield',
      '#ef4444',
      true,
      200,
      'monthly',
      1
    );
    
    INSERT INTO savings (id, user_id, account_id, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color, auto_save, auto_save_amount, auto_save_frequency, auto_save_day)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'Vacation Fund', 
      'Trip to Europe',
      5000, 
      1200, 
      CURRENT_DATE - INTERVAL '15 days', 
      CURRENT_DATE + INTERVAL '90 days', 
      'medium', 
      'active', 
      24.00,
      'Plane',
      '#3b82f6',
      true,
      100,
      'weekly',
      5
    );
    
    -- Add some contributions
    INSERT INTO savings_contributions (id, savings_id, amount, from_account_id, contributed_at)
    SELECT 
      gen_random_uuid()::TEXT,
      id,
      500,
      checking_account_id,
      CURRENT_DATE - (i || ' days')::INTERVAL
    FROM savings, generate_series(7, 28, 7) i
    WHERE name = 'Emergency Fund';
    
    INSERT INTO savings_contributions (id, savings_id, amount, from_account_id, contributed_at)
    SELECT 
      gen_random_uuid()::TEXT,
      id,
      200,
      checking_account_id,
      CURRENT_DATE - (i || ' days')::INTERVAL
    FROM savings, generate_series(3, 24, 7) i
    WHERE name = 'Vacation Fund';
    
  END IF;
END $$;

-- Verify the data
SELECT 'Savings templates created' as message, COUNT(*) FROM savings_templates;
SELECT 'Savings goals created' as message, COUNT(*) FROM savings;
SELECT 'Contributions created' as message, COUNT(*) FROM savings_contributions;
