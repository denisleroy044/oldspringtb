-- Drop and recreate the function with proper syntax
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
  v_fees DECIMAL(10,2);
  v_interest DECIMAL(10,2);
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
      WHEN type = 'credit' THEN amount ELSE -amount 
    END
  ), 0) INTO v_opening
  FROM transactions
  WHERE "accountId" = p_account_id AND created_at < v_start_date;
  
  -- Get period aggregates
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'credit' THEN amount END), 0),
    COALESCE(SUM(CASE WHEN type = 'debit' THEN amount END), 0),
    COUNT(*)
  INTO v_deposits, v_withdrawals, v_transaction_count
  FROM transactions
  WHERE "accountId" = p_account_id 
    AND created_at >= v_start_date 
    AND created_at <= v_end_date;
  
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
    v_account."accountType", 
    v_account."accountNumber", 
    v_account."accountType",
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

-- Create sample statements for demo user if they exist
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
  savings_account_id TEXT;
  v_month INTEGER;
  v_year INTEGER;
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
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not generate statement for checking account: %', SQLERRM;
        END;
      END IF;
      
      -- Generate for savings account
      IF savings_account_id IS NOT NULL THEN
        BEGIN
          PERFORM generate_monthly_statement(demo_user_id, savings_account_id, v_year, v_month);
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not generate statement for savings account: %', SQLERRM;
        END;
      END IF;
    END LOOP;
  END IF;
END $$;
