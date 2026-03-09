require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  try {
    // Check users table columns
    const usersColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Columns in users table:');
    usersColumns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });

    // Check if there's a trigger or view that might be causing issues
    const triggers = await pool.query(`
      SELECT trigger_name, event_manipulation 
      FROM information_schema.triggers 
      WHERE event_object_table = 'users'
    `);
    
    if (triggers.rows.length > 0) {
      console.log('\n⚠️  Triggers found on users table:');
      triggers.rows.forEach(trigger => {
        console.log(`   - ${trigger.trigger_name}`);
      });
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkSchema();
