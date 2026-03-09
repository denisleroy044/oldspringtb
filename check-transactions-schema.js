require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...\n');

    // Check users table
    const usersCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.log('📋 Users table columns:');
    usersCols.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    console.log('');

    // Check accounts table
    const accountsCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'accounts'
      ORDER BY ordinal_position
    `);
    console.log('📋 Accounts table columns:');
    accountsCols.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    console.log('');

    // Check transactions table
    const transactionsCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'transactions'
      ORDER BY ordinal_position
    `);
    console.log('📋 Transactions table columns:');
    transactionsCols.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    console.log('');

    // Check for demo user
    const demoUser = await pool.query(
      `SELECT id, email FROM users WHERE email = 'demo@oldspring.com'`
    );
    if (demoUser.rows.length > 0) {
      console.log('✅ Demo user found:', demoUser.rows[0].id);
      
      // Check demo user's accounts
      const demoAccounts = await pool.query(
        `SELECT id, "accountType", balance FROM accounts WHERE "userId" = $1`,
        [demoUser.rows[0].id]
      );
      console.log(`📊 Demo user has ${demoAccounts.rows.length} accounts`);
      demoAccounts.rows.forEach(acc => {
        console.log(`   - ${acc.accountType}: $${acc.balance}`);
      });

      // Check demo user's transactions
      const demoTx = await pool.query(
        `SELECT COUNT(*) FROM transactions WHERE "userId" = $1`,
        [demoUser.rows[0].id]
      );
      console.log(`📊 Demo user has ${demoTx.rows[0].count} transactions`);

    } else {
      console.log('❌ Demo user not found');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
