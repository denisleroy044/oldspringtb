require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkRealTableNames() {
  try {
    console.log('🔍 Checking actual table names in your database...\n');
    
    // Get all tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tables in database:');
    tables.rows.forEach(t => {
      console.log(`   - "${t.table_name}"`);
    });

    // Check if there's a users table with different casing
    const usersTables = tables.rows.filter(t => 
      t.table_name.toLowerCase() === 'users'
    );
    
    if (usersTables.length > 0) {
      console.log(`\n✅ Users table found as: "${usersTables[0].table_name}"`);
    } else {
      console.log('\n❌ No users table found at all!');
      
      // Try to find any table that might contain user data
      const possibleUserTables = tables.rows.filter(t => 
        t.table_name.includes('user') || t.table_name.includes('User') || t.table_name.includes('USER')
      );
      
      if (possibleUserTables.length > 0) {
        console.log('\n🔍 Possible user-related tables:');
        possibleUserTables.forEach(t => {
          console.log(`   - "${t.table_name}"`);
        });
      }
    }

    // Check a sample from each table to see structure
    for (const table of tables.rows.slice(0, 3)) {
      try {
        const sample = await pool.query(`SELECT * FROM "${table.table_name}" LIMIT 1`);
        console.log(`\n📊 Sample from "${table.table_name}":`);
        if (sample.rows.length > 0) {
          console.log('   Columns:', Object.keys(sample.rows[0]).join(', '));
        } else {
          console.log('   (empty table)');
        }
      } catch (err) {
        // Skip if can't query
      }
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkRealTableNames();
