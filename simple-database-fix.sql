-- ============================================
-- SIMPLE DATABASE FIX
-- ============================================

-- 1. Fix notifications table - add missing columns
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS data JSONB;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url TEXT;

-- 2. Create statements table from scratch
DROP TABLE IF EXISTS statements CASCADE;

CREATE TABLE statements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  account_id TEXT,
  statement_number TEXT UNIQUE NOT NULL,
  statement_type TEXT NOT NULL DEFAULT 'MONTHLY',
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

-- 3. Add foreign key constraints
ALTER TABLE statements 
ADD CONSTRAINT fk_statements_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE statements 
ADD CONSTRAINT fk_statements_account 
FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;

-- 4. Create indexes
CREATE INDEX idx_statements_user ON statements(user_id);
CREATE INDEX idx_statements_account ON statements(account_id);
CREATE INDEX idx_statements_period ON statements(period_start, period_end);

-- 5. Create a simple function to generate statements
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
    0, 0, 0, 0, 0,
    NOW(), 
    'GENERATED', 
    NOW(), 
    NOW()
  ) RETURNING id INTO v_statement_id;
  
  RETURN v_statement_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Create sample statements for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
  savings_account_id TEXT;
  v_month INTEGER;
  v_year INTEGER;
  v_counter INTEGER := 0;
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
      v_month := EXTRACT(MONTH FROM (CURRENT_DATE - (i || ' months')::INTERVAL));
      v_year := EXTRACT(YEAR FROM (CURRENT_DATE - (i || ' months')::INTERVAL));
      
      -- Generate for checking account
      IF checking_account_id IS NOT NULL THEN
        BEGIN
          PERFORM generate_monthly_statement(demo_user_id, checking_account_id, v_year, v_month);
          v_counter := v_counter + 1;
          RAISE NOTICE 'Generated checking statement for %/%', v_month, v_year;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not generate checking statement: %', SQLERRM;
        END;
      END IF;
      
      -- Generate for savings account
      IF savings_account_id IS NOT NULL THEN
        BEGIN
          PERFORM generate_monthly_statement(demo_user_id, savings_account_id, v_year, v_month);
          v_counter := v_counter + 1;
          RAISE NOTICE 'Generated savings statement for %/%', v_month, v_year;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not generate savings statement: %', SQLERRM;
        END;
      END IF;
    END LOOP;
    
    RAISE NOTICE 'Generated % statements for demo user', v_counter;
  END IF;
END $$;

-- 7. Verify the fixes
SELECT 'NOTIFICATIONS TABLE COLUMNS:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

SELECT 'STATEMENTS TABLE COLUMNS:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'statements' 
ORDER BY ordinal_position;

SELECT 'STATEMENT COUNT FOR DEMO USER:' as info;
SELECT u.email, COUNT(s.id) as statement_count
FROM users u
LEFT JOIN statements s ON u.id = s.user_id
WHERE u.email = 'demo@oldspring.com'
GROUP BY u.email;
