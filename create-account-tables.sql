-- ============================================
-- USER PROFILE TABLE (extends users table)
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US';
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- ============================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Email notifications
  email_notifications BOOLEAN DEFAULT true,
  email_transactions BOOLEAN DEFAULT true,
  email_promotions BOOLEAN DEFAULT false,
  email_security BOOLEAN DEFAULT true,
  email_newsletter BOOLEAN DEFAULT false,
  
  -- Push notifications
  push_notifications BOOLEAN DEFAULT true,
  push_transactions BOOLEAN DEFAULT true,
  push_security BOOLEAN DEFAULT true,
  push_reminders BOOLEAN DEFAULT true,
  
  -- SMS notifications
  sms_notifications BOOLEAN DEFAULT false,
  sms_transactions BOOLEAN DEFAULT false,
  sms_security BOOLEAN DEFAULT true,
  
  -- In-app notifications
  in_app_notifications BOOLEAN DEFAULT true,
  in_app_transactions BOOLEAN DEFAULT true,
  in_app_security BOOLEAN DEFAULT true,
  in_app_promotions BOOLEAN DEFAULT false,
  
  -- Marketing preferences
  marketing_emails BOOLEAN DEFAULT false,
  share_data BOOLEAN DEFAULT false,
  
  -- Created/Updated
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================
-- SECURITY SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS security_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Two-factor authentication
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_method TEXT, -- 'app', 'sms', 'email'
  two_factor_secret TEXT,
  two_factor_backup_codes TEXT[],
  
  -- Session management
  remember_me BOOLEAN DEFAULT true,
  session_timeout INTEGER DEFAULT 30, -- minutes
  max_sessions INTEGER DEFAULT 5,
  
  -- Login alerts
  login_alerts BOOLEAN DEFAULT true,
  suspicious_activity_alerts BOOLEAN DEFAULT true,
  
  -- Device management
  trusted_devices JSONB[],
  blocked_devices JSONB[],
  
  -- Password settings
  password_last_changed TIMESTAMP,
  password_expiry_days INTEGER DEFAULT 90,
  
  -- Created/Updated
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================
-- USER SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  device_name TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  location TEXT,
  is_current BOOLEAN DEFAULT false,
  last_active TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SUPPORT TICKETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'account', 'technical', 'billing', 'general', 'complaint'
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  attachments JSONB[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  closed_at TIMESTAMP
);

-- ============================================
-- SUPPORT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  admin_id TEXT,
  message TEXT NOT NULL,
  attachments JSONB[],
  is_admin BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- LIVE CHAT SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS live_chat_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'ended', 'timeout'
  assigned_to TEXT, -- admin id
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  rating INTEGER,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- LIVE CHAT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS live_chat_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  session_id TEXT NOT NULL REFERENCES live_chat_sessions(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  admin_id TEXT,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- USER SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Display settings
  theme TEXT DEFAULT 'light', -- 'light', 'dark', 'system'
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  time_format TEXT DEFAULT '12h',
  currency TEXT DEFAULT 'USD',
  
  -- Dashboard settings
  default_dashboard TEXT DEFAULT 'overview',
  show_balances BOOLEAN DEFAULT true,
  show_transactions BOOLEAN DEFAULT true,
  show_goals BOOLEAN DEFAULT true,
  
  -- Privacy settings
  profile_visibility TEXT DEFAULT 'private', -- 'public', 'private', 'contacts'
  activity_visibility TEXT DEFAULT 'private',
  
  -- Accessibility settings
  reduced_motion BOOLEAN DEFAULT false,
  high_contrast BOOLEAN DEFAULT false,
  font_size TEXT DEFAULT 'medium', -- 'small', 'medium', 'large'
  
  -- Created/Updated
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================
-- DEFAULT SETTINGS FOR EXISTING USERS
-- ============================================
-- Insert default settings for all existing users
INSERT INTO notification_preferences (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO security_settings (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_settings (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Update demo user with sample data
UPDATE users SET
  phone = '+1 (555) 123-4567',
  address_line1 = '123 Main Street',
  address_line2 = 'Apt 4B',
  city = 'New York',
  state = 'NY',
  postal_code = '10001',
  country = 'US',
  date_of_birth = '1990-01-15',
  updated_at = NOW()
WHERE email = 'demo@oldspring.com';

-- Verify the tables
SELECT '✅ Users table updated' as message;
SELECT '✅ Notification preferences table created' as message FROM information_schema.tables WHERE table_name = 'notification_preferences';
SELECT '✅ Security settings table created' as message FROM information_schema.tables WHERE table_name = 'security_settings';
SELECT '✅ User sessions table created' as message FROM information_schema.tables WHERE table_name = 'user_sessions';
SELECT '✅ Support tickets table created' as message FROM information_schema.tables WHERE table_name = 'support_tickets';
SELECT '✅ Support messages table created' as message FROM information_schema.tables WHERE table_name = 'support_messages';
SELECT '✅ Live chat sessions table created' as message FROM information_schema.tables WHERE table_name = 'live_chat_sessions';
SELECT '✅ Live chat messages table created' as message FROM information_schema.tables WHERE table_name = 'live_chat_messages';
SELECT '✅ User settings table created' as message FROM information_schema.tables WHERE table_name = 'user_settings';
