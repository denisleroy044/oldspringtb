-- Create savings table
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

-- Add foreign key constraint
ALTER TABLE savings 
ADD CONSTRAINT fk_savings_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create index
CREATE INDEX IF NOT EXISTS idx_savings_user ON savings(user_id);

-- Create savings_contributions table
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

-- Create savings_templates table
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

-- Verify the tables were created
SELECT '✅ Savings table created' as message FROM information_schema.tables WHERE table_name = 'savings'
UNION ALL
SELECT '✅ Savings contributions table created' FROM information_schema.tables WHERE table_name = 'savings_contributions'
UNION ALL
SELECT '✅ Savings templates table created' FROM information_schema.tables WHERE table_name = 'savings_templates';
