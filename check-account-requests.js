require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAccountRequests() {
  try {
    // Check if account_requests table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'account_requests'
      )
    `);
    
    console.log(`✅ account_requests table exists: ${tableCheck.rows[0].exists ? 'Yes' : 'No'}`);
    
    if (!tableCheck.rows[0].exists) {
      console.log('\n❌ Table does not exist. Creating it now...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS account_requests (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          "accountType" TEXT NOT NULL,
          status TEXT DEFAULT 'PENDING',
          "adminNotes" TEXT,
          "reviewedBy" TEXT,
          "reviewedAt" TIMESTAMP,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ account_requests table created');
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkAccountRequests();
