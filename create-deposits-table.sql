-- Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "accountId" TEXT REFERENCES "Account"(id) ON DELETE SET NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "method" TEXT NOT NULL,
  "currency" TEXT DEFAULT 'USD',
  "cryptoCurrency" TEXT,
  "paymentDetails" JSONB,
  "transactionId" TEXT,
  "senderInfo" TEXT,
  "adminNotes" TEXT,
  "status" TEXT DEFAULT 'PENDING',
  "approvedBy" TEXT,
  "approvedAt" TIMESTAMP,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create admin payment details table
CREATE TABLE IF NOT EXISTS admin_payment_details (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "method" TEXT NOT NULL UNIQUE,
  "details" JSONB NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "instructions" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits("userId");
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_method ON deposits(method);

-- Insert default admin payment details
INSERT INTO admin_payment_details (method, details, instructions) VALUES
  ('BANK', '{
    "bankName": "Oldspring Trust Bank",
    "accountName": "Oldspring Trust - Customer Deposits",
    "accountNumber": "123456789",
    "routingNumber": "655205039"
  }'::jsonb, 'ACH transfer may take 2-3 business days'),
  
  ('WIRE', '{
    "bankName": "Oldspring Trust Bank",
    "accountName": "Oldspring Trust - Customer Deposits",
    "accountNumber": "123456789",
    "routingNumber": "655205039",
    "swiftCode": "OLDSPR22",
    "address": "100 Bishopsgate, London EC2N 4AG"
  }'::jsonb, 'Include your name in wire instructions'),
  
  ('CRYPTO', '{
    "BTC": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "ETH": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "USDT": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  }'::jsonb, 'Send only USDT (ERC20) to this address'),
  
  ('CASHAPP', '{
    "cashtag": "$OldspringBank"
  }'::jsonb, 'Include your deposit ID in the note'),
  
  ('VENMO', '{
    "username": "@OldspringBank"
  }'::jsonb, 'Include your deposit ID in the note'),
  
  ('PAYPAL', '{
    "email": "deposits@oldspring.com"
  }'::jsonb, 'Send via Friends & Family')
ON CONFLICT (method) DO NOTHING;
