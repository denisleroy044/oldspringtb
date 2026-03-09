require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAdmin() {
  try {
    // Check if admin user exists
    const result = await pool.query(
      `SELECT id, email, role, "firstName", "lastName" FROM users WHERE email = $1`,
      ['hybrid@hth.com']
    );

    if (result.rows.length === 0) {
      console.log('❌ Admin user hybrid@hth.com not found!');
      
      // Create admin user
      const password = 'Hybrid@1234';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await pool.query(
        `INSERT INTO users (
          id, email, password, "firstName", "lastName", phone, role, "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid()::TEXT, $1, $2, $3, $4, $5, $6, NOW(), NOW()
        )`,
        ['hybrid@hth.com', hashedPassword, 'Admin', 'User', '+1234567890', 'admin']
      );
      
      console.log('✅ Admin user created successfully!');
    } else {
      const user = result.rows[0];
      console.log('✅ Admin user found:');
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
      
      if (user.role !== 'admin') {
        console.log('⚠️  User is not admin! Updating role...');
        await pool.query(
          `UPDATE users SET role = 'admin' WHERE id = $1`,
          [user.id]
        );
        console.log('✅ User updated to admin');
      }
    }

    // List all users
    const allUsers = await pool.query(
      `SELECT id, email, role FROM users ORDER BY "createdAt" DESC`
    );
    
    console.log('\n📋 All users:');
    allUsers.rows.forEach(u => {
      console.log(`   - ${u.email} (${u.role})`);
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkAdmin();
