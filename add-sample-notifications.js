require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addSampleNotifications() {
  console.log('🔍 Adding sample notifications...\n');

  try {
    // Get demo user
    const userRes = await pool.query(
      `SELECT id FROM users WHERE email = 'demo@oldspring.com'`
    );

    if (userRes.rows.length === 0) {
      console.log('❌ Demo user not found');
      return;
    }

    const userId = userRes.rows[0].id;
    console.log('✅ Found demo user:', userId);

    // Clear existing notifications
    await pool.query(`DELETE FROM notifications WHERE "userId" = $1`, [userId]);
    console.log('✅ Cleared existing notifications');

    // Add sample notifications with realistic data
    const notifications = [
      {
        type: 'system',
        title: 'Welcome to Oldspring Trust',
        message: 'Thank you for choosing Oldspring Trust. Your account is now fully activated and ready to use. Explore our digital banking features to manage your finances seamlessly.',
        data: { welcomeBonus: '$25', features: ['Mobile Banking', 'Bill Pay', 'Zelle'] }
      },
      {
        type: 'deposit',
        title: 'Deposit Confirmed',
        message: 'Your initial deposit of $5,000.00 has been successfully processed and credited to your checking account.',
        data: { amount: 5000, method: 'Wire Transfer', reference: 'DEP-2024-001' }
      },
      {
        type: 'security',
        title: 'Security Tip: Enable 2FA',
        message: 'Protect your account with an extra layer of security. Enable Two-Factor Authentication in your security settings to prevent unauthorized access.',
        actionUrl: '/dashboard/profile?tab=2fa'
      },
      {
        type: 'transfer',
        title: 'Transfer Completed',
        message: 'Your transfer of $250.00 to Savings Account has been completed successfully.',
        data: { amount: 250, from: 'Checking (****1234)', to: 'Savings (****5678)', fee: 0 }
      },
      {
        type: 'card',
        title: 'Card Application Approved',
        message: 'Your World Mastercard application has been approved! Your new card will arrive in 5-7 business days.',
        data: { cardType: 'World Mastercard', limit: 10000, apr: '14.49%' }
      },
      {
        type: 'system',
        title: 'New Feature: Instant Transfers',
        message: 'We\'ve upgraded our transfer system! Now you can send money instantly to other Oldspring Trust customers with no fees.',
        actionUrl: '/dashboard/transfers'
      },
      {
        type: 'deposit',
        title: 'Recurring Deposit Set Up',
        message: 'Your recurring monthly deposit of $500 has been scheduled for the 1st of each month starting next month.',
        data: { amount: 500, frequency: 'Monthly', nextDate: '2024-04-01' }
      },
      {
        type: 'security',
        title: 'New Device Login',
        message: 'A new login was detected from Chrome on Windows. If this wasn\'t you, please secure your account immediately.',
        data: { device: 'Chrome on Windows', location: 'New York, USA', time: new Date().toISOString() },
        isRead: false
      }
    ];

    // Insert notifications with different timestamps
    for (let i = 0; i < notifications.length; i++) {
      const notif = notifications[i];
      const daysAgo = Math.floor(i / 2); // Spread notifications over several days
      
      await pool.query(
        `INSERT INTO notifications (
          id, "userId", type, title, message, data, "actionUrl", "isRead", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '${daysAgo} days', NOW() - INTERVAL '${daysAgo} days')`,
        [
          `notif_${Date.now()}_${i}`,
          userId,
          notif.type,
          notif.title,
          notif.message,
          notif.data || null,
          notif.actionUrl || null,
          notif.isRead === false ? false : i > 3 // Mark older ones as read
        ]
      );
    }

    console.log(`✅ Added ${notifications.length} sample notifications`);

    // Verify notifications were added
    const count = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE "userId" = $1`,
      [userId]
    );
    console.log(`📊 Total notifications for user: ${count.rows[0].count}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

addSampleNotifications();
