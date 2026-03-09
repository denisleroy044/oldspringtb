import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Dynamically import the TypeScript file
async function testConnection() {
    console.log('🔍 Testing database connection...\n');
    
    try {
        // Import the adapter
        const { db } = await import('./src/lib/db/neon-adapter.ts');
        
        // Test users
        console.log('📊 Fetching users...');
        const users = await db.getUsers();
        console.log(`✅ Found ${users.length} users`);
        if (users.length > 0) {
            console.log('   Sample user:');
            console.log(`   - ID: ${users[0].id}`);
            console.log(`   - Email: ${users[0].email}`);
            console.log(`   - Name: ${users[0].name}`);
            console.log(`   - Balance: $${users[0].balance || 0}`);
            console.log(`   - Accounts: ${users[0].accounts?.length || 0}`);
            console.log(`   - Transactions: ${users[0].transactions?.length || 0}`);
        }
        
        // Test transactions
        console.log('\n📊 Fetching transactions...');
        const transactions = await db.getTransactions(5);
        console.log(`✅ Found ${transactions.length} transactions`);
        if (transactions.length > 0) {
            console.log('   Sample transaction:');
            console.log(`   - ID: ${transactions[0].id}`);
            console.log(`   - User: ${transactions[0].userName}`);
            console.log(`   - Type: ${transactions[0].type}`);
            console.log(`   - Amount: $${transactions[0].amount}`);
            console.log(`   - Description: ${transactions[0].description}`);
        }
        
        // Test stats
        console.log('\n📊 Fetching stats...');
        const stats = await db.getStats();
        console.log('✅ Stats:');
        console.log(`   - Total Users: ${stats.totalUsers}`);
        console.log(`   - New Users (30d): ${stats.newUsers}`);
        console.log(`   - Total Transactions: ${stats.totalTransactions}`);
        console.log(`   - Total Volume: $${stats.totalVolume}`);
        console.log(`   - Recent Transactions: ${stats.recentTransactions}`);
        console.log(`   - Total Credits: $${stats.totalCredits}`);
        console.log(`   - Total Debits: $${stats.totalDebits}`);
        
        console.log('\n✅ Database connection test passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('\nPlease check:');
        console.error('1. Your database connection in .env file');
        console.error('2. That the neon-adapter.ts file exists');
        console.error('3. That your database is accessible');
    }
}

testConnection().catch(console.error);
