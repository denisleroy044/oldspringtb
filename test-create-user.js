require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testCreate() {
  try {
    console.log('🔧 Testing user creation...');
    
    // Generate a unique email
    const testEmail = `test${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash('Test123!', 12);
    const id = crypto.randomUUID();
    
    console.log('📝 Creating user with ID:', id);
    
    const result = await pool.query(
      `INSERT INTO users (id, email, "firstName", "lastName", password, phone, role, "twoFactorEnabled", "emailVerified", "isActive", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
       RETURNING id, email`,
      [id, testEmail, 'Test', 'User', hashedPassword, '1234567890', 'USER', false, false, true]
    );
    
    console.log('✅ User created successfully:', result.rows[0]);
    
    // Verify the user exists
    const verify = await pool.query('SELECT id, email FROM users WHERE id = $1', [id]);
    console.log('🔍 Verification:', verify.rows[0]);
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

testCreate();
