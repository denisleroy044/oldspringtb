-- ============================================
-- CORE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Insert demo user (password: demo123)
INSERT INTO users (id, email, password, "firstName", "lastName", phone, role)
VALUES (
  '46c8c073-7817-4ce4-af9b-b6e74bb21b75',
  'demo@oldspring.com',
  '$2a$10$YourHashedPasswordHere',
  'Demo',
  'User',
  '+1234567890',
  'user'
) ON CONFLICT (email) DO NOTHING;

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "accountType" TEXT NOT NULL,
  "accountNumber" TEXT UNIQUE NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Insert demo accounts
INSERT INTO accounts (id, "userId", "accountType", "accountNumber", balance, currency)
VALUES 
  (gen_random_uuid()::TEXT, '46c8c073-7817-4ce4-af9b-b6e74bb21b75', 'CHECKING', '1234567890', 5000.00, 'USD'),
  (gen_random_uuid()::TEXT, '46c8c073-7817-4ce4-af9b-b6e74bb21b75', 'SAVINGS', '0987654321', 10000.00, 'USD')
ON CONFLICT DO NOTHING;

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "accountId" TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'completed',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Insert sample transactions
DO $$
DECLARE
  checking_id TEXT;
  user_id TEXT := '46c8c073-7817-4ce4-af9b-b6e74bb21b75';
BEGIN
  SELECT id INTO checking_id FROM accounts WHERE "userId" = user_id AND "accountType" = 'CHECKING' LIMIT 1;
  
  IF checking_id IS NOT NULL THEN
    INSERT INTO transactions ("userId", "accountId", type, amount, description, category, "createdAt") VALUES
    (user_id, checking_id, 'credit', 2500.00, 'Salary Deposit', 'income', NOW() - INTERVAL '5 days'),
    (user_id, checking_id, 'debit', 150.00, 'Grocery Store', 'shopping', NOW() - INTERVAL '4 days'),
    (user_id, checking_id, 'debit', 85.50, 'Restaurant', 'dining', NOW() - INTERVAL '3 days'),
    (user_id, checking_id, 'debit', 120.00, 'Electric Bill', 'utilities', NOW() - INTERVAL '2 days'),
    (user_id, checking_id, 'debit', 45.99, 'Netflix', 'subscription', NOW() - INTERVAL '1 day');
  END IF;
END $$;

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, is_read, created_at) VALUES
('46c8c073-7817-4ce4-af9b-b6e74bb21b75', 'system', 'Welcome to Oldspring Trust', 'Your account has been successfully created.', true, NOW() - INTERVAL '5 days'),
('46c8c073-7817-4ce4-af9b-b6e74bb21b75', 'deposit', 'Deposit Confirmed', 'Your deposit of $5,000.00 has been processed.', true, NOW() - INTERVAL '4 days'),
('46c8c073-7817-4ce4-af9b-b6e74bb21b75', 'security', 'Security Tip', 'Enable two-factor authentication for enhanced security.', false, NOW() - INTERVAL '2 days');

-- ============================================
-- STATEMENTS TABLE
-- ============================================

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
  opening_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  closing_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_deposits DECIMAL(10,2) DEFAULT 0,
  total_withdrawals DECIMAL(10,2) DEFAULT 0,
  transaction_count INTEGER DEFAULT 0,
  generated_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'GENERATED',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- STATEMENT GENERATION FUNCTION
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
  v_opening DECIMAL(10,2) := 0;
  v_closing DECIMAL(10,2) := 0;
  v_deposits DECIMAL(10,2) := 0;
  v_withdrawals DECIMAL(10,2) := 0;
  v_transaction_count INTEGER := 0;
  v_statement_number TEXT;
BEGIN
  -- Calculate date range
  v_start_date := MAKE_DATE(p_year, p_month, 1);
  v_end_date := (v_start_date + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- Get account details
  SELECT * INTO v_account FROM accounts WHERE id = p_account_id AND "userId" = p_user_id;
  
  -- Calculate actual values from transactions
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0),
    COUNT(*)
  INTO v_deposits, v_withdrawals, v_transaction_count
  FROM transactions
  WHERE "accountId" = p_account_id 
    AND DATE("createdAt") BETWEEN v_start_date AND v_end_date;
  
  -- Get opening balance (simplified - you might want to calculate this properly)
  SELECT COALESCE(SUM(
    CASE 
      WHEN type = 'credit' THEN amount 
      WHEN type = 'debit' THEN -amount 
      ELSE 0
    END
  ), 0) INTO v_opening
  FROM transactions
  WHERE "accountId" = p_account_id AND DATE("createdAt") < v_start_date;
  
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

-- ============================================
-- CREATE SAMPLE STATEMENTS
-- ============================================

DO $$
DECLARE
  demo_user_id TEXT := '46c8c073-7817-4ce4-af9b-b6e74bb21b75';
  checking_id TEXT;
  v_month INTEGER;
  v_year INTEGER;
BEGIN
  SELECT id INTO checking_id FROM accounts WHERE "userId" = demo_user_id AND "accountType" = 'CHECKING' LIMIT 1;
  
  IF checking_id IS NOT NULL THEN
    -- Generate statements for last 3 months
    FOR i IN 0..2 LOOP
      v_month := EXTRACT(MONTH FROM (CURRENT_DATE - (i || ' months')::INTERVAL));
      v_year := EXTRACT(YEAR FROM (CURRENT_DATE - (i || ' months')::INTERVAL));
      
      BEGIN
        PERFORM generate_monthly_statement(demo_user_id, checking_id, v_year, v_month);
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not generate statement: %', SQLERRM;
      END;
    END LOOP;
  END IF;
END $$;

-- ============================================
-- VERIFY SETUP
-- ============================================

SELECT 'USERS' as table_name, COUNT(*) as count FROM users;
SELECT 'ACCOUNTS' as table_name, COUNT(*) as count FROM accounts;
SELECT 'TRANSACTIONS' as table_name, COUNT(*) as count FROM transactions;
SELECT 'NOTIFICATIONS' as table_name, COUNT(*) as count FROM notifications;
SELECT 'STATEMENTS' as table_name, COUNT(*) as count FROM statements;
