require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupNotifications() {
  console.log('🔧 Setting up notifications system...\n');

  try {
    // First, let's check what tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Existing tables:');
    tables.rows.forEach(t => {
      console.log(`   - ${t.table_name}`);
    });
    console.log('');

    // Drop existing notifications table if it exists
    console.log('📦 Recreating notifications table...');
    await pool.query(`DROP TABLE IF EXISTS notifications CASCADE`);
    
    // Create notifications table with the correct schema
    await pool.query(`
      CREATE TABLE notifications (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        user_id TEXT NOT NULL,
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

    // Add foreign key constraint if users table exists
    const usersExist = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `);

    if (usersExist.rows[0].exists) {
      await pool.query(`
        ALTER TABLE notifications 
        ADD CONSTRAINT fk_notifications_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      `);
      console.log('✅ Added foreign key constraint to users table');
    }

    // Create indexes
    await pool.query(`
      CREATE INDEX idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX idx_notifications_is_read ON notifications(is_read);
      CREATE INDEX idx_notifications_created_at ON notifications(created_at);
    `);

    console.log('✅ Notifications table created successfully\n');

    // Check for demo user
    const userRes = await pool.query(
      `SELECT id, email FROM users WHERE email = 'demo@oldspring.com'`
    );

    if (userRes.rows.length > 0) {
      const userId = userRes.rows[0].id;
      console.log('✅ Found demo user:', userId);
      
      // Clear any existing notifications for this user
      await pool.query(`DELETE FROM notifications WHERE user_id = $1`, [userId]);
      
      // Add sample notifications
      console.log('📦 Adding sample notifications...');
      
      const notifications = [
        {
          type: 'system',
          title: 'Welcome to Oldspring Trust',
          message: 'Thank you for choosing Oldspring Trust. Your account is now fully activated and ready to use.',
          data: { welcomeBonus: 25, features: ['Mobile Banking', 'Bill Pay'] },
          action_url: '/dashboard',
          days_ago: 2
        },
        {
          type: 'deposit',
          title: 'Deposit Confirmed',
          message: 'Your initial deposit of $5,000.00 has been successfully processed and credited to your checking account.',
          data: { amount: 5000, method: 'Wire Transfer', reference: 'DEP-2024-001' },
          action_url: '/dashboard/transactions',
          days_ago: 1
        },
        {
          type: 'security',
          title: 'Security Tip: Enable 2FA',
          message: 'Protect your account with an extra layer of security. Enable Two-Factor Authentication in your security settings.',
          data: null,
          action_url: '/dashboard/profile?tab=2fa',
          days_ago: 0
        },
        {
          type: 'deposit',
          title: 'Deposit Request Pending',
          message: 'Your deposit of $500.00 via Crypto is pending approval. You will be notified once processed.',
          data: { amount: 500, method: 'crypto', currency: 'BTC', status: 'pending' },
          action_url: '/dashboard/deposit/requests',
          days_ago: 0
        },
        {
          type: 'transfer',
          title: 'Transfer Completed',
          message: 'Your transfer of $250.00 to Savings Account has been completed successfully.',
          data: { amount: 250, from: 'Checking', to: 'Savings', fee: 0 },
          action_url: '/dashboard/transactions',
          days_ago: 0
        },
        {
          type: 'card',
          title: 'Card Application Approved',
          message: 'Your World Mastercard application has been approved! Your new card will arrive in 5-7 business days.',
          data: { cardType: 'World Mastercard', limit: 10000, apr: '14.49%' },
          action_url: '/dashboard/cards',
          days_ago: 0
        }
      ];

      for (const notif of notifications) {
        await pool.query(
          `INSERT INTO notifications (
            id, user_id, type, title, message, data, is_read, action_url, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '${notif.days_ago} days', NOW() - INTERVAL '${notif.days_ago} days')`,
          [
            `notif_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
            userId,
            notif.type,
            notif.title,
            notif.message,
            notif.data ? JSON.stringify(notif.data) : null,
            notif.days_ago > 0, // Mark older ones as read
            notif.action_url
          ]
        );
      }

      console.log(`✅ Added ${notifications.length} sample notifications`);

      // Verify
      const stats = await pool.query(
        `SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN is_read = false THEN 1 END) as unread
         FROM notifications 
         WHERE user_id = $1`,
        [userId]
      );

      console.log(`\n📊 Notification summary:`);
      console.log(`   Total: ${stats.rows[0].total}`);
      console.log(`   Unread: ${stats.rows[0].unread}`);
    } else {
      console.log('⚠️ Demo user not found. Notifications table created but no sample data added.');
    }

    console.log('\n✅ Notifications system setup complete!');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

setupNotifications();
