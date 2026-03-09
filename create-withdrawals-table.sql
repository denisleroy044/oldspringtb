-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL, -- bank_transfer, card, wire, crypto
  recipient_name TEXT,
  recipient_account TEXT,
  recipient_bank TEXT,
  recipient_routing TEXT,
  recipient_address TEXT, -- for crypto
  fee DECIMAL(10,2) DEFAULT 0,
  reference TEXT UNIQUE,
  status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created ON withdrawals(created_at);
CREATE INDEX IF NOT EXISTS idx_withdrawals_reference ON withdrawals(reference);

-- Add withdrawal methods configuration
CREATE TABLE IF NOT EXISTS withdrawal_methods (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  method TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  fee_type TEXT DEFAULT 'fixed', -- fixed, percentage
  fee_value DECIMAL(10,2) DEFAULT 0,
  min_amount DECIMAL(10,2) DEFAULT 10,
  max_amount DECIMAL(10,2) DEFAULT 50000,
  processing_time TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default withdrawal methods
INSERT INTO withdrawal_methods (method, name, description, fee_type, fee_value, min_amount, max_amount, processing_time)
VALUES
  ('bank_transfer', 'Bank Transfer (ACH)', 'Transfer to your external bank account (1-3 business days)', 'fixed', 0, 10, 50000, '1-3 business days'),
  ('wire', 'Wire Transfer', 'Domestic wire transfer (same day)', 'fixed', 25, 1000, 100000, 'Same day'),
  ('card', 'Debit Card', 'Instant withdrawal to your debit card', 'percentage', 1.5, 5, 5000, 'Instant'),
  ('crypto', 'Cryptocurrency', 'Withdraw to crypto wallet', 'fixed', 0, 50, 10000, '10-30 minutes'),
  ('paypal', 'PayPal', 'Withdraw to PayPal account', 'percentage', 2.5, 5, 5000, 'Instant'),
  ('cashapp', 'Cash App', 'Withdraw to Cash App', 'percentage', 1.75, 5, 2500, 'Instant')
ON CONFLICT (method) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  processing_time = EXCLUDED.processing_time;

-- Add user saved withdrawal methods
CREATE TABLE IF NOT EXISTS user_withdrawal_methods (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  method TEXT NOT NULL REFERENCES withdrawal_methods(method) ON DELETE CASCADE,
  nickname TEXT,
  account_holder TEXT,
  account_number TEXT,
  routing_number TEXT,
  bank_name TEXT,
  wallet_address TEXT,
  email TEXT,
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, method, account_number)
);

CREATE INDEX IF NOT EXISTS idx_user_withdrawal_methods_user ON user_withdrawal_methods(user_id);
