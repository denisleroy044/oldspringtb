require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verifyDatabase() {
  console.log('🔍 Verifying database setup...\n');

  try {
    // Check connection
    const connTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log(`   Server time: ${connTest.rows[0].now}\n`);

    // List all tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Existing tables:');
    const requiredTables = ['users', 'accounts', 'transactions', 'notifications', 'deposits', 'transfers'];
    
    tables.rows.forEach(t => {
      const isRequired = requiredTables.includes(t.table_name);
      console.log(`   ${isRequired ? '✅' : '📁'} ${t.table_name}`);
    });

    // Check for missing required tables
    const existingTables = tables.rows.map(t => t.table_name);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log('\n❌ Missing required tables:');
      missingTables.forEach(t => console.log(`   - ${t}`));
      console.log('\n⚠️  Please run the SQL from create-missing-tables.sql');
    } else {
      console.log('\n✅ All required tables exist!');
    }

    // Check for demo user
    const demoUser = await pool.query(
      `SELECT id, email, "firstName", "lastName" FROM users WHERE email = 'demo@oldspring.com'`
    );

    if (demoUser.rows.length > 0) {
      console.log('\n✅ Demo user found:');
      console.log(`   ID: ${demoUser.rows[0].id}`);
      console.log(`   Name: ${demoUser.rows[0].firstName} ${demoUser.rows[0].lastName}`);
      console.log(`   Email: ${demoUser.rows[0].email}`);
    } else {
      console.log('\n⚠️  Demo user not found');
    }

    // Check notifications for demo user
    if (demoUser.rows.length > 0) {
      const notifications = await pool.query(
        `SELECT COUNT(*) FROM notifications WHERE "userId" = $1`,
        [demoUser.rows[0].id]
      );
      console.log(`\n📨 Notifications for demo user: ${notifications.rows[0].count}`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

verifyDatabase();
