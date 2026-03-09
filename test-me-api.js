require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testMeApi() {
  try {
    // Use a known user ID from your database
    // You can replace this with an actual user ID from your database
    const userId = '46c8c073-7817-4ce4-af9b-b6e74bb21b75'; // Your test user ID
    
    console.log('🔍 Testing me API logic with user ID:', userId);
    
    // Test the user query
    console.log('\n📝 Testing user query...');
    const userRes = await pool.query(
      `SELECT id, email, "firstName", "lastName", role, "twoFactorEnabled", "emailVerified", "isActive", phone 
       FROM users WHERE id = $1`,
      [userId]
    );
    
    console.log('✅ User query successful, rows:', userRes.rows.length);
    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      console.log('User data:', {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }

    // Test the accounts query
    console.log('\n📝 Testing accounts query...');
    const accountsRes = await pool.query(
      'SELECT id, name, type, balance, currency, "accountNumber", status FROM accounts WHERE "userId" = $1 AND status = $2 ORDER BY "createdAt" ASC',
      [userId, 'ACTIVE']
    );
    
    console.log('✅ Accounts query successful, rows:', accountsRes.rows.length);
    if (accountsRes.rows.length > 0) {
      console.log('First account:', {
        id: accountsRes.rows[0].id,
        name: accountsRes.rows[0].name,
        type: accountsRes.rows[0].type,
        balance: accountsRes.rows[0].balance
      });
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

testMeApi();
