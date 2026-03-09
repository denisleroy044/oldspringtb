-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Display settings
  theme TEXT DEFAULT 'light',
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
  profile_visibility TEXT DEFAULT 'private',
  activity_visibility TEXT DEFAULT 'private',
  
  -- Accessibility settings
  reduced_motion BOOLEAN DEFAULT false,
  high_contrast BOOLEAN DEFAULT false,
  font_size TEXT DEFAULT 'medium',
  
  -- Created/Updated
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Insert default settings for existing users
INSERT INTO user_settings (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Verify the table was created
SELECT '✅ User settings table created' as message;
SELECT COUNT(*) as user_count FROM user_settings;
