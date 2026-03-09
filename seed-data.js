const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedData() {
  console.log('🌱 Seeding database with realistic data...\n');
  
  try {
    // Get all users
    const users = await pool.query(`
      SELECT id, email, name FROM neon_auth.user
    `);
    
    console.log(`Found ${users.rows.length} users`);
    
    if (users.rows.length === 0) {
      console.log('❌ No users found. Please create users first.');
      return;
    }
    
    // Clear existing transactions
    await pool.query('DELETE FROM public.transactions');
    console.log('✅ Cleared existing transactions');
    
    // Add realistic transactions for each user
    const descriptions = [
      'Salary deposit',
      'Rent payment',
      'Grocery store',
      'Restaurant',
      'Online shopping',
      'Utility bill',
      'Transfer from savings',
      'Investment return',
      'Freelance payment',
      'Tax refund',
      'Insurance premium',
      'Gym membership',
      'Streaming service',
      'Phone bill',
      'Car payment'
    ];
    
    for (const user of users.rows) {
      console.log(`\n📊 Adding transactions for ${user.email}...`);
      
      // Add 5-10 random transactions per user
      const numTransactions = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < numTransactions; i++) {
        const type = Math.random() > 0.3 ? 'credit' : 'debit'; // 70% credits, 30% debits
        const amount = type === 'credit' 
          ? Math.floor(Math.random() * 5000) + 500  // $500-$5500
          : Math.floor(Math.random() * 500) + 50;    // $50-$550
        
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        // Random date within last 90 days
        const daysAgo = Math.floor(Math.random() * 90);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        await pool.query(`
          INSERT INTO public.transactions (user_id, type, amount, description, created_at)
          VALUES ($1, $2, $3, $4, $5)
        `, [user.id, type, amount, description, date]);
      }
      
      console.log(`   Added ${numTransactions} transactions`);
    }
    
    // Verify the data
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as total_credits,
        SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as total_debits
      FROM public.transactions
    `);
    
    console.log('\n📊 Final Statistics:');
    console.log(`   Total transactions: ${stats.rows[0].total}`);
    console.log(`   Total credits: $${parseFloat(stats.rows[0].total_credits || 0).toFixed(2)}`);
    console.log(`   Total debits: $${parseFloat(stats.rows[0].total_debits || 0).toFixed(2)}`);
    
    console.log('\n✅ Seeding complete!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  } finally {
    await pool.end();
  }
}

seedData().catch(console.error);
