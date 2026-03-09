require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function listAllTables() {
  try {
    console.log('📋 Listing all tables in database:\n');
    
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (result.rows.length === 0) {
      console.log('No tables found in public schema');
    } else {
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }
    
    console.log('\n🔍 Checking for savings table specifically:');
    const savingsExists = result.rows.some(row => row.table_name === 'savings');
    console.log(`  Savings table exists: ${savingsExists ? '✅ YES' : '❌ NO'}`);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

listAllTables();
