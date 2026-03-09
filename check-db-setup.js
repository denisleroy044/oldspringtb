require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSetup() {
  try {
    console.log('🔍 Checking database setup...\n');

    // Check users table
    const users = await pool.query('SELECT COUNT(*) FROM "User"');
    console.log(`✅ Users table: ${users.rows[0].count} users`);

    // Check accounts table
    const accounts = await pool.query('SELECT COUNT(*) FROM "Account"');
    console.log(`✅ Accounts table: ${accounts.rows[0].count} accounts`);

    // Check cards table
    try {
      const cards = await pool.query('SELECT COUNT(*) FROM "Card"');
      console.log(`✅ Cards table: ${cards.rows[0].count} cards`);
    } catch (e) {
      console.log('❌ Cards table does not exist yet');
    }

    // Check card_requests table
    try {
      const requests = await pool.query('SELECT COUNT(*) FROM "CardRequest"');
      console.log(`✅ CardRequest table: ${requests.rows[0].count} requests`);
    } catch (e) {
      console.log('❌ CardRequest table does not exist yet');
    }

    console.log('\n📋 Next steps:');
    console.log('1. If any tables are missing, run the SQL in create-card-tables.sql');
    console.log('2. Go to Neon Console → SQL Editor');
    console.log('3. Copy and paste the SQL from create-card-tables.sql');
    console.log('4. Click Run');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkSetup();
