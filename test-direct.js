require('dotenv').config();
const { Pool } = require('pg');

// Remove -pooler from the hostname for direct connection
const directUrl = process.env.DATABASE_URL.replace('-pooler', '');
console.log('🔍 Testing direct connection:', directUrl.replace(/:[^:@]*@/, ':***@'));

const pool = new Pool({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000
});

async function test() {
  try {
    const client = await pool.connect();
    console.log('✅ Direct connection successful!');
    const res = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', res.rows[0].now);
    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

test();
