const { db } = require('./src/lib/db/neon-adapter');

async function test() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test users
    console.log('📊 Fetching users...');
    const users = await db.getUsers();
    console.log(`✅ Found ${users.length} users`);
    if (users.length > 0) {
      console.log('   Sample user:', JSON.stringify(users[0], null, 2));
    }
    
    // Test transactions
    console.log('\n📊 Fetching transactions...');
    const transactions = await db.getTransactions(5);
    console.log(`✅ Found ${transactions.length} transactions`);
    if (transactions.length > 0) {
      console.log('   Sample transaction:', JSON.stringify(transactions[0], null, 2));
    }
    
    // Test stats
    console.log('\n📊 Fetching stats...');
    const stats = await db.getStats();
    console.log('✅ Stats:', JSON.stringify(stats, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

test();
