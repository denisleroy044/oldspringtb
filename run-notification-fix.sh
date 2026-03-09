#!/bin/bash

echo "🔔 Running Complete Notification System Fix"
echo "============================================"
echo ""

# Step 1: Check if tables exist and create them
echo "📦 Step 1: Checking and creating database tables..."
node -e "
const { Pool } = require('pg');
require('dotenv').config();

async function setup() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Create notifications table if not exists
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        \"userId\" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        data JSONB,
        \"isRead\" BOOLEAN DEFAULT false,
        \"actionUrl\" TEXT,
        \"createdAt\" TIMESTAMP DEFAULT NOW(),
        \"updatedAt\" TIMESTAMP DEFAULT NOW()
      )
    \`);

    // Create indexes
    await pool.query(\`
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(\"userId\");
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(\"isRead\");
      CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(\"createdAt\");
    \`);

    console.log('✅ Notifications table ready');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
setup();"
echo ""

# Step 2: Add sample notifications
echo "📦 Step 2: Adding sample notifications..."
node add-sample-notifications.js
echo ""

# Step 3: Verify setup
echo "📦 Step 3: Verifying notification system..."
node -e "
const { Pool } = require('pg');
require('dotenv').config();

async function verify() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Get demo user
    const userRes = await pool.query(
      \`SELECT id, email FROM users WHERE email = 'demo@oldspring.com'\`
    );

    if (userRes.rows.length === 0) {
      console.log('⚠️ Demo user not found');
      process.exit(0);
    }

    const userId = userRes.rows[0].id;

    // Count notifications
    const countRes = await pool.query(
      \`SELECT COUNT(*) as total, 
        COUNT(CASE WHEN \"isRead\" = false THEN 1 END) as unread
       FROM notifications WHERE \"userId\" = \$1\`,
      [userId]
    );

    console.log('✅ Notification system verified:');
    console.log(`   Total notifications: ${countRes.rows[0].total}`);
    console.log(`   Unread notifications: ${countRes.rows[0].unread}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
verify();"
echo ""

echo ""
echo "🎉 Notification system is now ready!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your development server:"
echo "      npm run dev"
echo ""
echo "   2. Visit the notifications page:"
echo "      http://localhost:3000/dashboard/notifications"
echo ""
echo "   3. Test deposit notifications:"
echo "      - Go to http://localhost:3000/dashboard/deposit"
echo "      - Submit a deposit request"
echo "      - Check header bell for new notification"
echo ""

chmod +x run-notification-fix.sh
