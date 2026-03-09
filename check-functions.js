require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkFunctions() {
  try {
    // Check for any functions that might reference 'name'
    const functions = await pool.query(`
      SELECT proname, prosrc 
      FROM pg_proc 
      WHERE prosrc LIKE '%name%'
    `);
    
    if (functions.rows.length > 0) {
      console.log('⚠️  Functions found containing "name":');
      functions.rows.forEach(func => {
        console.log(`   - ${func.proname}`);
      });
    } else {
      console.log('✅ No functions found containing "name"');
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkFunctions();
