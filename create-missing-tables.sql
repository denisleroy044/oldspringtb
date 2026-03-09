-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "data" JSONB,
  "isRead" BOOLEAN DEFAULT false,
  "actionUrl" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "accountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications("isRead");
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications("createdAt");
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits("userId");
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits("status");
CREATE INDEX IF NOT EXISTS idx_deposits_created ON deposits("createdAt");

-- Add sample notifications for demo user (if exists)
DO $$
DECLARE
  demo_user_id TEXT;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    INSERT INTO notifications (id, "userId", type, title, message, "createdAt", "updatedAt")
    VALUES 
      (gen_random_uuid()::TEXT, demo_user_id, 'system', 'Welcome to Oldspring Trust', 'Thank you for banking with us. Your account is now active.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
      (gen_random_uuid()::TEXT, demo_user_id, 'deposit', 'Deposit Confirmed', 'Your initial deposit of $5,000.00 has been processed successfully.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
      (gen_random_uuid()::TEXT, demo_user_id, 'security', 'Security Tip', 'Enable two-factor authentication for enhanced account security.', NOW(), NOW());
  END IF;
END $$;
