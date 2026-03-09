-- First, let's check the actual table names in your database
-- Run this query to see all tables:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Create cards table with correct case-sensitive table names
CREATE TABLE IF NOT EXISTS "Card" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "accountId" TEXT REFERENCES "Account"(id) ON DELETE SET NULL,
  "cardType" TEXT NOT NULL, -- DEBIT, CREDIT, VIRTUAL
  "cardBrand" TEXT NOT NULL, -- VISA, MASTERCARD, AMEX
  "cardNumber" TEXT NOT NULL UNIQUE,
  "lastFour" TEXT NOT NULL,
  "cardholderName" TEXT NOT NULL,
  "expiryMonth" INTEGER NOT NULL,
  "expiryYear" INTEGER NOT NULL,
  "cvv" TEXT NOT NULL,
  "status" TEXT DEFAULT 'ACTIVE', -- ACTIVE, FROZEN, BLOCKED, EXPIRED, PENDING
  "isVirtual" BOOLEAN DEFAULT false,
  "creditLimit" DECIMAL(10,2),
  "availableCredit" DECIMAL(10,2),
  "currentBalance" DECIMAL(10,2) DEFAULT 0,
  "apr" DECIMAL(5,2),
  "rewardsPoints" INTEGER DEFAULT 0,
  "issuedAt" TIMESTAMP DEFAULT NOW(),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create card_requests table with correct case-sensitive table names
CREATE TABLE IF NOT EXISTS "CardRequest" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "accountId" TEXT REFERENCES "Account"(id) ON DELETE SET NULL,
  "cardType" TEXT NOT NULL,
  "cardBrand" TEXT NOT NULL,
  "status" TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  "adminNotes" TEXT,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Add indexes with correct table names
CREATE INDEX IF NOT EXISTS idx_cards_user ON "Card"("userId");
CREATE INDEX IF NOT EXISTS idx_cards_account ON "Card"("accountId");
CREATE INDEX IF NOT EXISTS idx_cards_status ON "Card"(status);
CREATE INDEX IF NOT EXISTS idx_card_requests_user ON "CardRequest"("userId");
CREATE INDEX IF NOT EXISTS idx_card_requests_status ON "CardRequest"(status);

-- Create test cards for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
BEGIN
  -- Get demo user ID (using correct case - "User")
  SELECT id INTO demo_user_id FROM "User" WHERE email = 'demo@oldspring.com';
  
  IF demo_user_id IS NULL THEN
    RAISE NOTICE 'Demo user not found, skipping test cards';
    RETURN;
  END IF;
  
  -- Get their checking account (using correct case - "Account")
  SELECT id INTO checking_account_id FROM "Account" WHERE "userId" = demo_user_id AND "accountType" = 'CHECKING' LIMIT 1;
  
  -- Insert a debit card (using correct table name - "Card")
  INSERT INTO "Card" (
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

  RAISE NOTICE '✅ Test cards created successfully';
END $$;
