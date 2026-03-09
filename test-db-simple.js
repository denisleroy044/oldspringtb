const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_l5tqF7ETxWni@ep-ancient-breeze-ab7hwkm5.eu-west-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test connection
    const connectResult = await pool.query('SELECT NOW() as time');
    console.log('✅ Database connected at:', connectResult.rows[0].time);
    
    // Check users in neon_auth schema
    console.log('\n📊 Checking neon_auth.users...');
    const usersResult = await pool.query(`
      SELECT id, email, name, "createdAt" 
      FROM neon_auth.user 
      LIMIT 5
    `);
    console.log(`✅ Found ${usersResult.rows.length} users`);
    usersResult.rows.forEach((user, i) => {
      console.log(`   ${i+1}. ${user.email} (${user.name || 'No name'})`);
    });
    
    // Check if transactions table exists
    console.log('\n📊 Checking public.transactions...');
    const tableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'transactions'
      )
    `);
    
    if (tableResult.rows[0].exists) {
      console.log('✅ transactions table exists');
      
      const countResult = await pool.query('SELECT COUNT(*) FROM public.transactions');
      console.log(`   Total transactions: ${countResult.rows[0].count}`);
      
      if (parseInt(countResult.rows[0].count) > 0) {
        const sampleResult = await pool.query(`
          SELECT t.*, u.email 
          FROM public.transactions t
          JOIN neon_auth.user u ON u.id = t.user_id
          LIMIT 3
        `);
        console.log('   Sample transactions:');
        sampleResult.rows.forEach(t => {
          console.log(`   - ${t.email}: $${t.amount} (${t.type}) - ${t.description}`);
        });
      }
    } else {
      console.log('⚠️ transactions table does not exist');
      
      // Create transactions table
      console.log('\n📝 Creating transactions table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS public.transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          type VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
          amount DECIMAL(15,2) NOT NULL,
          description TEXT,
          status VARCHAR(20) DEFAULT 'completed',
          reference VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_user
            FOREIGN KEY(user_id) 
            REFERENCES neon_auth.user(id)
            ON DELETE CASCADE
        )
      `);
      console.log('✅ transactions table created');
      
      // Add sample transactions if there are users
      if (usersResult.rows.length > 0) {
        console.log('\n📝 Adding sample transactions...');
        for (const user of usersResult.rows) {
          // Add a credit transaction
          await pool.query(`
            INSERT INTO public.transactions (user_id, type, amount, description)
            VALUES ($1, 'credit', 1000.00, 'Welcome bonus')
          `, [user.id]);
          
          // Add a debit transaction
          await pool.query(`
            INSERT INTO public.transactions (user_id, type, amount, description)
            VALUES ($1, 'debit', 25.50, 'Test purchase')
          `, [user.id]);
        }
        console.log('✅ Sample transactions added');
      }
    }
    
    // Test the adapter by running a query through it
    console.log('\n📊 Testing through adapter...');
    const { db } = require('./src/lib/db/neon-adapter.ts');
    
    const users = await db.getUsers();
    console.log(`✅ Adapter found ${users.length} users`);
    
    const transactions = await db.getTransactions(5);
    console.log(`✅ Adapter found ${transactions.length} transactions`);
    
    const stats = await db.getStats();
    console.log('✅ Adapter stats:', stats);
    
    console.log('\n✅ All tests passed! Your database is ready.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection().catch(console.error);
