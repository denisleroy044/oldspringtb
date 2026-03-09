-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "accountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
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

-- Create card_requests table for pending approvals
CREATE TABLE IF NOT EXISTS card_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "accountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  "cardType" TEXT NOT NULL,
  "cardBrand" TEXT NOT NULL,
  "status" TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  "adminNotes" TEXT,
  "reviewedBy" TEXT,
  "reviewedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_cards_user ON cards("userId");
CREATE INDEX IF NOT EXISTS idx_cards_account ON cards("accountId");
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_card_requests_user ON card_requests("userId");
CREATE INDEX IF NOT EXISTS idx_card_requests_status ON card_requests(status);
