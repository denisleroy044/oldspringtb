-- ============================================
-- CALENDAR SYSTEM
-- ============================================

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- payment, bill, goal, savings, appointment, reminder
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  all_day BOOLEAN DEFAULT false,
  location TEXT,
  color TEXT,
  repeat_type TEXT, -- none, daily, weekly, monthly, yearly
  repeat_interval INTEGER DEFAULT 1,
  repeat_end_date DATE,
  reminder_time INTEGER, -- minutes before event
  reminder_sent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active', -- active, completed, cancelled
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Calendar event participants
CREATE TABLE IF NOT EXISTS event_participants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  event_id TEXT REFERENCES calendar_events(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  email TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Calendar event attachments
CREATE TABLE IF NOT EXISTS event_attachments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  event_id TEXT REFERENCES calendar_events(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Calendar integrations (Google Calendar, etc.)
CREATE TABLE IF NOT EXISTS calendar_integrations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- google, outlook, apple
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- GOALS SYSTEM
-- ============================================

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  category TEXT NOT NULL, -- savings, investment, debt, purchase, travel, education, retirement
  name TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'active', -- active, paused, completed, cancelled
  progress DECIMAL(5,2) DEFAULT 0,
  auto_save BOOLEAN DEFAULT false,
  auto_save_amount DECIMAL(10,2),
  auto_save_frequency TEXT, -- weekly, biweekly, monthly
  auto_save_account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  icon TEXT,
  color TEXT,
  notes TEXT,
  metadata JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Goal milestones
CREATE TABLE IF NOT EXISTS goal_milestones (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  goal_id TEXT REFERENCES goals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  target_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Goal contributions
CREATE TABLE IF NOT EXISTS goal_contributions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  goal_id TEXT REFERENCES goals(id) ON DELETE CASCADE,
  milestone_id TEXT REFERENCES goal_milestones(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  from_account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  transaction_id TEXT,
  notes TEXT,
  contributed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Goal reminders
CREATE TABLE IF NOT EXISTS goal_reminders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  goal_id TEXT REFERENCES goals(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  reminder_type TEXT, -- milestone, deadline, contribution
  message TEXT,
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SAVINGS SYSTEM
-- ============================================

-- Savings goals (simplified version)
CREATE TABLE IF NOT EXISTS savings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'active', -- active, paused, completed, cancelled
  progress DECIMAL(5,2) DEFAULT 0,
  auto_save BOOLEAN DEFAULT false,
  auto_save_amount DECIMAL(10,2),
  auto_save_frequency TEXT, -- weekly, biweekly, monthly
  auto_save_day INTEGER, -- day of month/week for auto-save
  icon TEXT,
  color TEXT,
  notes TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Savings contributions
CREATE TABLE IF NOT EXISTS savings_contributions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  savings_id TEXT REFERENCES savings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  from_account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  transaction_id TEXT,
  notes TEXT,
  contributed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Savings templates (for quick creation)
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
  ('Emergency Fund', 'Save for unexpected expenses', 10000, 'Shield', 'red'),
  ('Vacation', 'Save for your dream vacation', 5000, 'Plane', 'blue'),
  ('New Car', 'Save for a vehicle purchase', 25000, 'Car', 'green'),
  ('Home Down Payment', 'Save for your first home', 50000, 'Home', 'purple'),
  ('Wedding', 'Save for your special day', 15000, 'Heart', 'pink'),
  ('Education', 'Save for school or courses', 10000, 'GraduationCap', 'orange'),
  ('Retirement', 'Save for retirement', 100000, 'Umbrella', 'indigo'),
  ('New Phone', 'Save for the latest gadget', 1000, 'Smartphone', 'teal'),
  ('Christmas Gifts', 'Save for holiday shopping', 2000, 'Gift', 'red'),
  ('Home Renovation', 'Save for home improvements', 15000, 'Tool', 'brown')
ON CONFLICT DO NOTHING;

-- ============================================
-- INDEXES
-- ============================================

-- Calendar indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(event_type);
CREATE INDEX IF NOT EXISTS idx_event_participants_event ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user ON event_participants(user_id);

-- Goals indexes
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal ON goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal ON goal_contributions(goal_id);

-- Savings indexes
CREATE INDEX IF NOT EXISTS idx_savings_user ON savings(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_status ON savings(status);
CREATE INDEX IF NOT EXISTS idx_savings_target_date ON savings(target_date);
CREATE INDEX IF NOT EXISTS idx_savings_contributions_savings ON savings_contributions(savings_id);

-- ============================================
-- SAMPLE DATA FOR DEMO USER
-- ============================================

-- Add sample calendar events for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
  v_event_id TEXT;
  v_date DATE;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get demo user's checking account
  SELECT id INTO checking_account_id FROM accounts 
  WHERE "userId" = demo_user_id AND "accountType" = 'CHECKING' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    -- Clear existing events
    DELETE FROM calendar_events WHERE user_id = demo_user_id;
    
    -- Add sample events
    v_date := CURRENT_DATE;
    
    -- Bill payment events
    INSERT INTO calendar_events (id, user_id, title, description, event_type, start_date, color, status) VALUES
    (gen_random_uuid()::TEXT, demo_user_id, 'Electricity Bill Due', 'Monthly electricity bill payment', 'bill', v_date + INTERVAL '5 days', '#ef4444', 'active'),
    (gen_random_uuid()::TEXT, demo_user_id, 'Water Bill Due', 'Monthly water bill payment', 'bill', v_date + INTERVAL '10 days', '#ef4444', 'active'),
    (gen_random_uuid()::TEXT, demo_user_id, 'Rent Payment', 'Monthly rent payment', 'bill', v_date + INTERVAL '2 days', '#ef4444', 'active'),
    (gen_random_uuid()::TEXT, demo_user_id, 'Internet Bill', 'Monthly internet service payment', 'bill', v_date + INTERVAL '15 days', '#ef4444', 'active'),
    (gen_random_uuid()::TEXT, demo_user_id, 'Credit Card Payment', 'Monthly credit card payment', 'payment', v_date + INTERVAL '20 days', '#3b82f6', 'active'),
    
    -- Goal events
    (gen_random_uuid()::TEXT, demo_user_id, 'Emergency Fund Milestone', 'Reach 50% of emergency fund goal', 'goal', v_date + INTERVAL '30 days', '#10b981', 'active'),
    (gen_random_uuid()::TEXT, demo_user_id, 'Vacation Planning Meeting', 'Discuss vacation plans and budget', 'appointment', v_date + INTERVAL '7 days', '#8b5cf6', 'active'),
    
    -- Savings events
    (gen_random_uuid()::TEXT, demo_user_id, 'Auto-Save Day', 'Weekly automatic savings transfer', 'savings', v_date + INTERVAL '3 days', '#f59e0b', 'active'),
    (gen_random_uuid()::TEXT, demo_user_id, 'Savings Review', 'Review savings progress', 'reminder', v_date + INTERVAL '14 days', '#6366f1', 'active'),
    
    -- Reminders
    (gen_random_uuid()::TEXT, demo_user_id, 'Review Investment Portfolio', 'Quarterly investment review', 'reminder', v_date + INTERVAL '21 days', '#ec4899', 'active'),
    (gen_random_uuid()::TEXT, demo_user_id, 'Tax Deadline Reminder', 'Quarterly tax payment due', 'reminder', v_date + INTERVAL '45 days', '#ef4444', 'active');
  END IF;
END $$;

-- Add sample goals for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
  v_goal_id TEXT;
  v_milestone_id TEXT;
  v_date DATE;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get demo user's checking account
  SELECT id INTO checking_account_id FROM accounts 
  WHERE "userId" = demo_user_id AND "accountType" = 'CHECKING' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    -- Clear existing goals
    DELETE FROM goals WHERE user_id = demo_user_id;
    
    v_date := CURRENT_DATE;
    
    -- Emergency Fund Goal
    INSERT INTO goals (id, user_id, account_id, category, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'savings',
      'Emergency Fund', 
      'Build a 6-month emergency fund for unexpected expenses',
      15000, 
      5000, 
      v_date - INTERVAL '30 days', 
      v_date + INTERVAL '150 days', 
      'high', 
      'active', 
      33.33,
      'Shield',
      'red'
    ) RETURNING id INTO v_goal_id;
    
    -- Add milestones for emergency fund
    INSERT INTO goal_milestones (id, goal_id, name, target_amount, target_date) VALUES
    (gen_random_uuid()::TEXT, v_goal_id, '25% - First Quarter', 3750, v_date + INTERVAL '45 days'),
    (gen_random_uuid()::TEXT, v_goal_id, '50% - Halfway There', 7500, v_date + INTERVAL '75 days'),
    (gen_random_uuid()::TEXT, v_goal_id, '75% - Almost There', 11250, v_date + INTERVAL '105 days'),
    (gen_random_uuid()::TEXT, v_goal_id, '100% - Goal Achieved', 15000, v_date + INTERVAL '150 days');
    
    -- Add contributions
    INSERT INTO goal_contributions (id, goal_id, amount, from_account_id, contributed_at) VALUES
    (gen_random_uuid()::TEXT, v_goal_id, 1000, checking_account_id, v_date - INTERVAL '28 days'),
    (gen_random_uuid()::TEXT, v_goal_id, 1000, checking_account_id, v_date - INTERVAL '21 days'),
    (gen_random_uuid()::TEXT, v_goal_id, 1000, checking_account_id, v_date - INTERVAL '14 days'),
    (gen_random_uuid()::TEXT, v_goal_id, 1000, checking_account_id, v_date - INTERVAL '7 days'),
    (gen_random_uuid()::TEXT, v_goal_id, 1000, checking_account_id, v_date);
    
    -- Vacation Goal
    INSERT INTO goals (id, user_id, account_id, category, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'travel',
      'European Vacation', 
      'Save for a 2-week trip to Europe',
      8000, 
      2500, 
      v_date - INTERVAL '15 days', 
      v_date + INTERVAL '75 days', 
      'medium', 
      'active', 
      31.25,
      'Plane',
      'blue'
    );
    
    -- New Car Goal
    INSERT INTO goals (id, user_id, account_id, category, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'purchase',
      'New Car', 
      'Save for a down payment on a new car',
      15000, 
      3000, 
      v_date - INTERVAL '10 days', 
      v_date + INTERVAL '120 days', 
      'medium', 
      'active', 
      20.00,
      'Car',
      'green'
    );
    
    -- Retirement Goal
    INSERT INTO goals (id, user_id, account_id, category, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'retirement',
      'Retirement Fund', 
      'Build retirement savings',
      500000, 
      25000, 
      v_date - INTERVAL '365 days', 
      v_date + INTERVAL '3650 days', 
      'high', 
      'active', 
      5.00,
      'Umbrella',
      'indigo'
    );
    
    -- Home Down Payment Goal
    INSERT INTO goals (id, user_id, account_id, category, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'purchase',
      'Home Down Payment', 
      'Save for a down payment on a house',
      50000, 
      10000, 
      v_date - INTERVAL '60 days', 
      v_date + INTERVAL '240 days', 
      'high', 
      'active', 
      20.00,
      'Home',
      'purple'
    );
  END IF;
END $$;

-- Add sample savings for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
  v_savings_id TEXT;
  v_date DATE;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get demo user's checking account
  SELECT id INTO checking_account_id FROM accounts 
  WHERE "userId" = demo_user_id AND "accountType" = 'CHECKING' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    -- Clear existing savings
    DELETE FROM savings WHERE user_id = demo_user_id;
    
    v_date := CURRENT_DATE;
    
    -- Short-term savings
    INSERT INTO savings (id, user_id, account_id, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color, auto_save, auto_save_amount, auto_save_frequency, auto_save_day)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'New Phone', 
      'Save for the latest smartphone',
      1200, 
      800, 
      v_date - INTERVAL '20 days', 
      v_date + INTERVAL '40 days', 
      'medium', 
      'active', 
      66.67,
      'Smartphone',
      'teal',
      true,
      50,
      'weekly',
      1
    );
    
    -- Christmas savings
    INSERT INTO savings (id, user_id, account_id, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color, auto_save, auto_save_amount, auto_save_frequency, auto_save_day)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'Christmas Gifts', 
      'Save for holiday gifts and celebrations',
      2000, 
      1200, 
      v_date - INTERVAL '60 days', 
      v_date + INTERVAL '150 days', 
      'high', 
      'active', 
      60.00,
      'Gift',
      'red',
      true,
      100,
      'biweekly',
      15
    );
    
    -- Wedding savings
    INSERT INTO savings (id, user_id, account_id, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'Wedding Fund', 
      'Save for the perfect wedding day',
      15000, 
      3000, 
      v_date - INTERVAL '90 days', 
      v_date + INTERVAL '270 days', 
      'high', 
      'active', 
      20.00,
      'Heart',
      'pink'
    );
    
    -- Home renovation savings
    INSERT INTO savings (id, user_id, account_id, name, description, target_amount, current_amount, start_date, target_date, priority, status, progress, icon, color)
    VALUES (
      gen_random_uuid()::TEXT, 
      demo_user_id, 
      checking_account_id,
      'Kitchen Renovation', 
      'Save for kitchen remodeling',
      25000, 
      5000, 
      v_date - INTERVAL '120 days', 
      v_date + INTERVAL '240 days', 
      'medium', 
      'active', 
      20.00,
      'Tool',
      'brown'
    );
    
    -- Add contributions
    INSERT INTO savings_contributions (id, savings_id, amount, from_account_id, contributed_at)
    SELECT 
      gen_random_uuid()::TEXT,
      id,
      50,
      checking_account_id,
      v_date - (i || ' days')::INTERVAL
    FROM savings, generate_series(1, 10) i
    WHERE name = 'New Phone';
    
    INSERT INTO savings_contributions (id, savings_id, amount, from_account_id, contributed_at)
    SELECT 
      gen_random_uuid()::TEXT,
      id,
      100,
      checking_account_id,
      v_date - (i*7 || ' days')::INTERVAL
    FROM savings, generate_series(1, 8) i
    WHERE name = 'Christmas Gifts';
  END IF;
END $$;

-- Verify data was inserted
SELECT 'Calendar Events' as type, COUNT(*) as count FROM calendar_events WHERE user_id IN (SELECT id FROM users WHERE email = 'demo@oldspring.com');
SELECT 'Goals' as type, COUNT(*) as count FROM goals WHERE user_id IN (SELECT id FROM users WHERE email = 'demo@oldspring.com');
SELECT 'Savings' as type, COUNT(*) as count FROM savings WHERE user_id IN (SELECT id FROM users WHERE email = 'demo@oldspring.com');
