require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAndCreateTables() {
  console.log('🔍 Checking database setup...\n');

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected\n');

    // Check if deposits table exists
    const depositsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'deposits'
      )
    `);

    if (!depositsCheck.rows[0].exists) {
      console.log('📦 Creating deposits table...');
      
      await pool.query(`
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
        )
      `);
      
      console.log('✅ Deposits table created\n');
    } else {
      console.log('✅ Deposits table already exists\n');
    }

    // Check if notifications table exists
    const notifCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notifications'
      )
    `);

    if (!notifCheck.rows[0].exists) {
      console.log('📦 Creating notifications table...');
      
      await pool.query(`
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
        )
      `);
      
      console.log('✅ Notifications table created\n');
    } else {
      console.log('✅ Notifications table already exists\n');
    }

    // Create indexes
    console.log('📦 Creating indexes...');
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits("userId");
      CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits("status");
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications("userId");
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications("isRead");
    `);
    
    console.log('✅ Indexes created\n');

    // Add sample notifications for demo user
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE email = 'demo@oldspring.com'`
    );

    if (userCheck.rows.length > 0) {
      const userId = userCheck.rows[0].id;
      
      const notifCount = await pool.query(
        `SELECT COUNT(*) FROM notifications WHERE "userId" = $1`,
        [userId]
      );

      if (parseInt(notifCount.rows[0].count) === 0) {
        console.log('📦 Adding sample notifications for demo user...');
        
        await pool.query(`
          INSERT INTO notifications (id, "userId", type, title, message, "createdAt", "updatedAt")
          VALUES 
            (gen_random_uuid()::TEXT, $1, 'system', 'Welcome to Oldspring Trust', 'Thank you for banking with us. Your account is now active.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
            (gen_random_uuid()::TEXT, $1, 'deposit', 'Deposit Confirmed', 'Your initial deposit of $5,000.00 has been processed successfully.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
            (gen_random_uuid()::TEXT, $1, 'security', 'Security Tip', 'Enable two-factor authentication for enhanced account security.', NOW(), NOW())
        `, [userId]);
        
        console.log('✅ Sample notifications added\n');
      }
    }

    // Verify tables
    console.log('📋 Verifying tables:');
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    tables.rows.forEach(t => {
      console.log(`   - ${t.table_name}`);
    });

    console.log('\n✅ Database setup complete!');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkAndCreateTables();
