require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkData() {
  try {
    // Check users
    const users = await pool.query('SELECT id, email, "firstName", "lastName" FROM users LIMIT 5');
    console.log('\n📊 USERS:');
    users.rows.forEach(u => console.log(`   - ${u.firstName} ${u.lastName} (${u.email})`));

    // Check accounts
    const accounts = await pool.query('SELECT * FROM accounts LIMIT 5');
    console.log('\n📊 ACCOUNTS:');
    if (accounts.rows.length === 0) {
      console.log('   No accounts found');
    } else {
      accounts.rows.forEach(a => console.log('   ', a));
    }

    // Check transactions
    const transactions = await pool.query('SELECT * FROM transactions LIMIT 5');
    console.log('\n📊 TRANSACTIONS:');
    if (transactions.rows.length === 0) {
      console.log('   No transactions found');
    } else {
      transactions.rows.forEach(t => console.log('   ', t));
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkData();
