require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    const res = await pool.query('SELECT NOW() as time, current_database() as db');
    console.log('✅ Connected successfully!');
    console.log(`   Database: ${res.rows[0].db}`);
    console.log(`   Time: ${res.rows[0].time}`);
    
    // Test users table
    try {
      const users = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`\n📊 Users in database: ${users.rows[0].count}`);
    } catch (err) {
      console.log('\n⚠️ Users table not accessible:', err.message);
    }
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if database server is running');
    console.log('2. Verify your IP is whitelisted');
    console.log('3. Try using the connection pooler URL');
    console.log('4. Check your firewall settings');
  } finally {
    await pool.end();
  }
}

testConnection();
