-- Create cards table
CREATE TABLE IF NOT EXISTS "Card" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "accountId" TEXT REFERENCES "Account"(id) ON DELETE SET NULL,
  "cardType" TEXT NOT NULL,
  "cardBrand" TEXT NOT NULL,
  "cardNumber" TEXT NOT NULL UNIQUE,
  "lastFour" TEXT NOT NULL,
  "cardholderName" TEXT NOT NULL,
  "expiryMonth" INTEGER NOT NULL,
  "expiryYear" INTEGER NOT NULL,
  "cvv" TEXT NOT NULL,
  "status" TEXT DEFAULT 'ACTIVE',
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

-- Create card_requests table
CREATE TABLE IF NOT EXISTS "CardRequest" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "accountId" TEXT REFERENCES "Account"(id) ON DELETE SET NULL,
  "cardType" TEXT NOT NULL,
  "cardBrand" TEXT NOT NULL,
  "status" TEXT DEFAULT 'PENDING',
  "adminNotes" TEXT,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cards_user ON "Card"("userId");
CREATE INDEX IF NOT EXISTS idx_cards_account ON "Card"("accountId");
CREATE INDEX IF NOT EXISTS idx_cards_status ON "Card"(status);
CREATE INDEX IF NOT EXISTS idx_card_requests_user ON "CardRequest"("userId");
CREATE INDEX IF NOT EXISTS idx_card_requests_status ON "CardRequest"(status);

-- Insert a test debit card for the demo user (if they exist)
DO $$
DECLARE
  demo_user_id TEXT;
  checking_account_id TEXT;
BEGIN
  -- Get demo user ID
  SELECT id INTO demo_user_id FROM "User" WHERE email = 'demo@oldspring.com';
  
  IF demo_user_id IS NOT NULL THEN
    -- Get their checking account
    SELECT id INTO checking_account_id FROM "Account" WHERE "userId" = demo_user_id AND "accountType" = 'CHECKING' LIMIT 1;
    
    -- Insert a debit card if not exists
    IF NOT EXISTS (SELECT 1 FROM "Card" WHERE "userId" = demo_user_id AND "cardType" = 'DEBIT') THEN
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
      RAISE NOTICE '✅ Test debit card created for demo user';
    END IF;
  END IF;
END $$;
