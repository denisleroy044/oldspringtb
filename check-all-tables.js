require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAllTables() {
  try {
    console.log('📋 Listing all tables in database:\n');
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    tables.rows.forEach(t => {
      console.log(`   - ${t.table_name}`);
    });

    console.log('\n🔍 Checking "User" table columns:');
    const userColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User'
      ORDER BY ordinal_position
    `);
    
    if (userColumns.rows.length > 0) {
      userColumns.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('   ❌ "User" table not found');
    }

    console.log('\n🔍 Checking "Account" table columns:');
    const accountColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Account'
      ORDER BY ordinal_position
    `);
    
    if (accountColumns.rows.length > 0) {
      accountColumns.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('   ❌ "Account" table not found');
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkAllTables();
