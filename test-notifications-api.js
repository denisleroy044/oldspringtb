require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testAPI() {
  console.log('🔍 Testing notifications setup...\n');

  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'notifications'
      )
    `);

    console.log(`📋 Notifications table exists: ${tableCheck.rows[0].exists}`);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ Table does not exist. Run setup first.');
      return;
    }

    // Show table structure
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'notifications'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Table structure:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });

    // Count notifications
    const count = await pool.query(`SELECT COUNT(*) FROM notifications`);
    console.log(`\n📊 Total notifications in database: ${count.rows[0].count}`);

    if (count.rows[0].count === '0') {
      console.log('⚠️ No notifications found. Run the setup script to add sample data.');
    } else {
      // Show sample
      const sample = await pool.query(`
        SELECT id, user_id, type, title, is_read, created_at 
        FROM notifications 
        LIMIT 3
      `);
      
      console.log('\n📝 Sample notifications:');
      sample.rows.forEach((row, i) => {
        console.log(`   ${i+1}. ${row.title} (${row.type}) - Read: ${row.is_read}`);
      });
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

testAPI();
