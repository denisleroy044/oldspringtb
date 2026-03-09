require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkUser() {
  try {
    // Check if demo user exists
    const demoUser = await pool.query(
      'SELECT id, email, name, password, role, "emailVerified", "isActive" FROM users WHERE email = $1',
      ['demo@oldspring.com']
    );
    
    if (demoUser.rows.length > 0) {
      console.log('✅ Demo user exists:');
      console.log('   ID:', demoUser.rows[0].id);
      console.log('   Email:', demoUser.rows[0].email);
      console.log('   Name:', demoUser.rows[0].name);
      console.log('   Role:', demoUser.rows[0].role);
      console.log('   Email Verified:', demoUser.rows[0].emailVerified);
      console.log('   Active:', demoUser.rows[0].isActive);
      
      // Test password
      const testPassword = 'Demo@123456';
      const isValid = await bcrypt.compare(testPassword, demoUser.rows[0].password);
      console.log('   Password valid for Demo@123456:', isValid);
    } else {
      console.log('❌ Demo user not found');
    }
    
    // List all users
    const allUsers = await pool.query('SELECT email, role, "emailVerified" FROM users');
    console.log('\n📋 All users:');
    allUsers.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) Verified: ${user.emailVerified}`);
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkUser();
