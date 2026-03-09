-- Create a test debit card for the demo user
-- First, get the demo user ID and their checking account
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
BEGIN
  -- Get demo user ID
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com';
  
  -- Get their checking account
  SELECT id INTO checking_account_id FROM accounts WHERE "userId" = demo_user_id AND "accountType" = 'CHECKING' LIMIT 1;
  
  -- Insert a debit card
  INSERT INTO cards (
    id, "userId", "accountId", "cardType", "cardBrand", 
    "cardNumber", "lastFour", "cardholderName", 
    "expiryMonth", "expiryYear", "cvv", 
    status, "isVirtual", "currentBalance", "rewardsPoints"
  ) VALUES (
    gen_random_uuid()::TEXT,
    demo_user_id,
    checking_account_id,
    'DEBIT',
    'VISA',
    '4532015112830366',
    '0366',
    'James Donaldson',
    12,
    2028,
    '123',
    'ACTIVE',
    false,
    5250.00,
    1250
  );

  -- Insert a credit card for demo
  INSERT INTO cards (
    id, "userId", "accountId", "cardType", "cardBrand", 
    "cardNumber", "lastFour", "cardholderName", 
    "expiryMonth", "expiryYear", "cvv", 
    status, "isVirtual", "creditLimit", "availableCredit", "currentBalance", "apr", "rewardsPoints"
  ) VALUES (
    gen_random_uuid()::TEXT,
    demo_user_id,
    NULL,
    'CREDIT',
    'MASTERCARD',
    '5424180123456789',
    '6789',
    'James Donaldson',
    10,
    2027,
    '456',
    'ACTIVE',
    false,
    10000.00,
    6750.75,
    3249.25,
    18.99,
    2450
  );

  -- Insert a virtual card for demo
  INSERT INTO cards (
    id, "userId", "accountId", "cardType", "cardBrand", 
    "cardNumber", "lastFour", "cardholderName", 
    "expiryMonth", "expiryYear", "cvv", 
    status, "isVirtual", "currentBalance"
  ) VALUES (
    gen_random_uuid()::TEXT,
    demo_user_id,
    checking_account_id,
    'VIRTUAL',
    'VISA',
    '4916123456789012',
    '9012',
    'James Donaldson',
    8,
    2026,
    '789',
    'ACTIVE',
    true,
    1250.00
  );

  -- Also create a card for the admin user
  SELECT id INTO demo_user_id FROM users WHERE email = 'admin@oldspring.com';
  SELECT id INTO checking_account_id FROM accounts WHERE "userId" = demo_user_id AND "accountType" = 'ADMIN' LIMIT 1;
  
  INSERT INTO cards (
    id, "userId", "accountId", "cardType", "cardBrand", 
    "cardNumber", "lastFour", "cardholderName", 
    "expiryMonth", "expiryYear", "cvv", 
    status, "isVirtual"
  ) VALUES (
    gen_random_uuid()::TEXT,
    demo_user_id,
    checking_account_id,
    'DEBIT',
    'VISA',
    '4532111122223333',
    '3333',
    'Admin User',
    5,
    2029,
    '321',
    'ACTIVE',
    false
  );

  RAISE NOTICE '✅ Test cards created successfully';
END $$;
