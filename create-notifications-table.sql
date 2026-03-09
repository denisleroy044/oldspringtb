-- Create notification_preferences table
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

-- Insert default preferences for existing users
INSERT INTO notification_preferences (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Verify the table was created
SELECT '✅ Notification preferences table created' as message;
SELECT COUNT(*) as user_count FROM notification_preferences;
