require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkTransferSetup() {
  try {
    console.log('🔍 Checking transfer system setup...\n');
    
    // Check if transfers table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'transfers'
      )
    `);
    
    console.log(`📋 Transfers table exists: ${tableCheck.rows[0].exists ? 'Yes' : 'No'}`);
    
    if (!tableCheck.rows[0].exists) {
      console.log('\n🔨 Creating transfers table...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS transfers (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          "fromAccountId" TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
          "toAccountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
          "toAccountNumber" TEXT,
          "toBankName" TEXT,
          "toAccountName" TEXT,
          "amount" DECIMAL(10,2) NOT NULL,
          "description" TEXT,
          "reference" TEXT UNIQUE NOT NULL,
          "status" TEXT DEFAULT 'PENDING',
          "type" TEXT DEFAULT 'TRANSFER',
          "fee" DECIMAL(10,2) DEFAULT 0,
          "completedAt" TIMESTAMP,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ Transfers table created');
      
      // Create indexes
      await pool.query('CREATE INDEX IF NOT EXISTS idx_transfers_user ON transfers("userId")');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_transfers_from ON transfers("fromAccountId")');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_transfers_to ON transfers("toAccountId")');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_transfers_reference ON transfers(reference)');
      console.log('✅ Indexes created');
    }
    
    // Check demo user's accounts
    const userRes = await pool.query(
      `SELECT id, email, "firstName", "lastName" FROM users WHERE email = 'demo@oldspring.com'`
    );
    
    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      console.log('\n👤 Demo user:', user.firstName, user.lastName);
      
      const accountsRes = await pool.query(
        `SELECT id, "accountType", "accountNumber", balance FROM accounts WHERE "userId" = $1`,
        [user.id]
      );
      
      console.log('\n💰 Demo user accounts:');
      accountsRes.rows.forEach(acc => {
        console.log(`   - ${acc.accountType}: ${acc.accountNumber} ($${acc.balance})`);
      });
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkTransferSetup();
