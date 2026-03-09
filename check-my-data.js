require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkMyData() {
  try {
    // Use a specific user ID - replace with your actual user ID
    // For demo, let's use the demo user
    const userEmail = 'demo@oldspring.com';
    
    const userRes = await pool.query(
      'SELECT id, email, "firstName", "lastName" FROM users WHERE email = $1',
      [userEmail]
    );
    
    const user = userRes.rows[0];
    console.log('\n👤 USER:', user);
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    // Get user's accounts
    const accounts = await pool.query(
      'SELECT * FROM accounts WHERE "userId" = $1',
      [user.id]
    );
    console.log('\n💰 ACCOUNTS:', accounts.rows);
    
    // Get user's transactions
    const transactions = await pool.query(
      'SELECT * FROM transactions WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 10',
      [user.id]
    );
    console.log('\n📊 TRANSACTIONS:', transactions.rows);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkMyData();
