-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,
  role TEXT DEFAULT 'USER',
  "twoFactorEnabled" BOOLEAN DEFAULT FALSE,
  "emailVerified" BOOLEAN DEFAULT FALSE,
  avatar TEXT,
  phone TEXT,
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create Account table
CREATE TABLE IF NOT EXISTS "Account" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT,
  type TEXT NOT NULL,
  balance FLOAT DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  "accountNumber" TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_account_user ON "Account"("userId");
CREATE INDEX IF NOT EXISTS idx_account_number ON "Account"("accountNumber");
