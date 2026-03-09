-- Create currency swap requests table
CREATE TABLE IF NOT EXISTS swap_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  to_account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  from_amount DECIMAL(10,2) NOT NULL,
  to_amount DECIMAL(10,2) NOT NULL,
  exchange_rate DECIMAL(10,6) NOT NULL,
  fee DECIMAL(10,2) DEFAULT 0,
  reference TEXT UNIQUE,
  status TEXT DEFAULT 'COMPLETED', -- COMPLETED, PENDING, FAILED
  completed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create exchange rates cache table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate DECIMAL(10,6) NOT NULL,
  bid DECIMAL(10,6),
  ask DECIMAL(10,6),
  source TEXT DEFAULT 'api',
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(from_currency, to_currency)
);

-- Create currency accounts table for supported currencies
CREATE TABLE IF NOT EXISTS currency_accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  currency TEXT NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, currency, account_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_swap_requests_user ON swap_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_created ON swap_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_pair ON exchange_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_currency_accounts_user ON currency_accounts(user_id);

-- Insert default exchange rates
INSERT INTO exchange_rates (from_currency, to_currency, rate, bid, ask, source) VALUES
  ('USD', 'EUR', 0.92, 0.9195, 0.9205, 'default'),
  ('USD', 'GBP', 0.79, 0.7885, 0.7915, 'default'),
  ('USD', 'JPY', 148.50, 148.30, 148.70, 'default'),
  ('USD', 'CAD', 1.35, 1.3480, 1.3520, 'default'),
  ('USD', 'CHF', 0.88, 0.8790, 0.8810, 'default'),
  ('USD', 'AUD', 1.52, 1.5180, 1.5220, 'default'),
  ('USD', 'CNY', 7.19, 7.1850, 7.1950, 'default'),
  ('EUR', 'USD', 1.09, 1.0880, 1.0920, 'default'),
  ('GBP', 'USD', 1.27, 1.2680, 1.2720, 'default'),
  ('EUR', 'GBP', 0.86, 0.8580, 0.8620, 'default'),
  ('BTC', 'USD', 65420, 65300, 65540, 'default'),
  ('ETH', 'USD', 3520, 3510, 3530, 'default')
ON CONFLICT (from_currency, to_currency) DO UPDATE SET
  rate = EXCLUDED.rate,
  bid = EXCLUDED.bid,
  ask = EXCLUDED.ask,
  updated_at = NOW();
