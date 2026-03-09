require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkUserTable() {
  try {
    // Check all user-related tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%user%'
      ORDER BY table_name
    `);
    
    console.log('📋 User-related tables found:');
    if (tables.rows.length === 0) {
      console.log('   None found');
    } else {
      tables.rows.forEach(t => console.log(`   - "${t.table_name}"`));
    }
    
    // Check the actual structure of the users table
    try {
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);
      
      console.log('\n📋 Columns in "users" table:');
      columns.rows.forEach(col => console.log(`   - ${col.column_name} (${col.data_type})`));
    } catch (err) {
      console.log('\n❌ Could not query "users" table');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkUserTable();
