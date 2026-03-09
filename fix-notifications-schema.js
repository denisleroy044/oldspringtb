require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixNotificationsSchema() {
  console.log('🔧 Fixing notifications table schema...\n');

  try {
    // Check current table structure
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'notifications'
      ORDER BY ordinal_position
    `);

    console.log('📋 Current notifications table columns:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    console.log('');

    // Drop and recreate the table with correct schema (lowercase, no quotes needed)
    console.log('📦 Recreating notifications table with correct schema...');
    
    await pool.query(`DROP TABLE IF EXISTS notifications CASCADE`);
    
    await pool.query(`
      CREATE TABLE notifications (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        data JSONB,
        is_read BOOLEAN DEFAULT false,
        action_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX idx_notifications_is_read ON notifications(is_read);
      CREATE INDEX idx_notifications_created_at ON notifications(created_at);
    `);

    console.log('✅ Notifications table recreated successfully\n');

    // Get demo user
    const userRes = await pool.query(
      `SELECT id FROM users WHERE email = 'demo@oldspring.com'`
    );

    if (userRes.rows.length > 0) {
      const userId = userRes.rows[0].id;
      console.log('✅ Found demo user:', userId);
      
      // Add sample notifications
      console.log('📦 Adding sample notifications...');
      
      const notifications = [
        ['system', 'Welcome to Oldspring Trust', 'Thank you for banking with us. Your account is now active.', null, '/dashboard'],
        ['deposit', 'Deposit Confirmed', 'Your initial deposit of $5,000.00 has been processed successfully.', JSON.stringify({ amount: 5000, method: 'wire' }), '/dashboard/transactions'],
        ['security', 'Security Tip', 'Enable two-factor authentication for enhanced account security.', null, '/dashboard/profile?tab=2fa'],
        ['deposit', 'Deposit Request', 'Your deposit of $500.00 is pending approval.', JSON.stringify({ amount: 500, method: 'crypto', status: 'pending' }), '/dashboard/deposit/requests'],
        ['transfer', 'Transfer Completed', 'Your transfer of $250.00 to Savings Account has been completed.', JSON.stringify({ amount: 250, to: 'Savings' }), '/dashboard/transactions'],
        ['card', 'Card Application Approved', 'Your World Mastercard application has been approved!', JSON.stringify({ cardType: 'World Mastercard', limit: 10000 }), '/dashboard/cards']
      ];

      for (let i = 0; i < notifications.length; i++) {
        const [type, title, message, data, actionUrl] = notifications[i];
        const daysAgo = Math.floor(i / 2);
        
        await pool.query(
          `INSERT INTO notifications (
            id, user_id, type, title, message, data, is_read, action_url, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '${daysAgo} days', NOW() - INTERVAL '${daysAgo} days')`,
          [
            `notif_${Date.now()}_${i}`,
            userId,
            type,
            title,
            message,
            data,
            i > 3 ? true : false, // Mark older ones as read
            actionUrl
          ]
        );
      }

      console.log(`✅ Added ${notifications.length} sample notifications`);

      // Verify
      const count = await pool.query(
        `SELECT COUNT(*) as total, 
          COUNT(CASE WHEN is_read = false THEN 1 END) as unread
         FROM notifications WHERE user_id = $1`,
        [userId]
      );

      console.log(`\n📊 Notification summary:`);
      console.log(`   Total: ${count.rows[0].total}`);
      console.log(`   Unread: ${count.rows[0].unread}`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

fixNotificationsSchema();
