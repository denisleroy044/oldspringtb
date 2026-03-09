const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_l5tqF7ETxWni@ep-ancient-breeze-ab7hwkm5.eu-west-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const connectTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connected at:', connectTest.rows[0].now);
    
    // Check users table structure
    console.log('\n📋 Users table columns:');
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
      ORDER BY ordinal_position
    `);
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    
    // Try to query users with exact column names
    console.log('\n👥 Attempting to fetch users...');
    try {
      const users = await pool.query(`
        SELECT 
          id,
          email,
          "firstName",
          "lastName",
          role,
          "kycStatus",
          "isActive",
          balance,
          "createdAt"
        FROM public.users
        LIMIT 5
      `);
      console.log(`✅ Found ${users.rows.length} users`);
      users.rows.forEach((user, i) => {
        console.log(`\n   User ${i + 1}:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Balance: $${user.balance}`);
      });
    } catch (err) {
      console.error('❌ Error querying users:', err.message);
    }
    
    await pool.end();
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

test();
