require('dotenv').config();
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testAccountRequest() {
  try {
    // First, get a user ID (using demo user)
    const userRes = await pool.query(
      `SELECT id FROM users WHERE email = 'demo@oldspring.com'`
    );
    
    if (userRes.rows.length === 0) {
      console.log('❌ Demo user not found');
      return;
    }
    
    const userId = userRes.rows[0].id;
    console.log('✅ Found demo user:', userId);
    
    // Check if account_requests table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'account_requests'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ account_requests table does not exist');
      return;
    }
    
    // Create a test request
    const requestId = crypto.randomUUID();
    await pool.query(`
      INSERT INTO account_requests (id, "userId", "accountType", status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
    `, [requestId, userId, 'CHECKING', 'PENDING']);
    
    console.log('✅ Test request created with ID:', requestId);
    
    // Verify it was created
    const verifyRes = await pool.query(
      `SELECT * FROM account_requests WHERE id = $1`,
      [requestId]
    );
    
    if (verifyRes.rows.length > 0) {
      console.log('✅ Request verified in database');
      console.log('   Status:', verifyRes.rows[0].status);
      console.log('   Created:', verifyRes.rows[0].createdAt);
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

testAccountRequest();
