require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkCurrentDB() {
  try {
    console.log('🔍 Checking current database connection...\n');
    
    // Get current database name
    const dbName = await pool.query('SELECT current_database()');
    console.log(`📊 Connected to database: ${dbName.rows[0].current_database}`);
    
    // Get current user
    const currentUser = await pool.query('SELECT current_user');
    console.log(`👤 Connected as user: ${currentUser.rows[0].current_user}`);
    
    // Get all tables in this database
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tables in this database:');
    if (tables.rows.length === 0) {
      console.log('   No tables found');
    } else {
      tables.rows.forEach(t => console.log(`   - ${t.table_name}`));
    }
    
    // Check if we have users table
    const hasUsers = tables.rows.some(t => t.table_name === 'users' || t.table_name === 'User');
    console.log(`\n✅ Has users table: ${hasUsers ? 'Yes' : 'No'}`);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkCurrentDB();
