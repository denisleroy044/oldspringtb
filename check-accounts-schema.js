require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAccountsSchema() {
  try {
    // Check accounts table columns
    const accountsColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'accounts'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Columns in accounts table:');
    accountsColumns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });

    // Get a sample account
    const sample = await pool.query('SELECT * FROM accounts LIMIT 1');
    if (sample.rows.length > 0) {
      console.log('\n👤 Sample account data:');
      console.log(sample.rows[0]);
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkAccountsSchema();
