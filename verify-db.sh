#!/bin/bash

# Fix and verify the database setup

echo "🔍 Verifying database setup..."
echo "=============================="

# Check if the adapter file exists
if [ -f "src/lib/db/neon-adapter.ts" ]; then
    echo "✅ neon-adapter.ts exists"
else
    echo "❌ neon-adapter.ts is missing"
fi

# Check if the API routes exist
if [ -f "src/app/api/admin/transactions/route.ts" ]; then
    echo "✅ transactions API route exists"
else
    echo "❌ transactions API route missing"
fi

if [ -f "src/app/api/admin/users/route.ts" ]; then
    echo "✅ users API route exists"
else
    echo "❌ users API route missing"
fi

if [ -f "src/app/api/admin/stats/route.ts" ]; then
    echo "✅ stats API route exists"
else
    echo "❌ stats API route missing"
fi

# Create a proper test script that works with TypeScript
echo ""
echo "📝 Creating fixed test script..."

cat > test-db-connection.mjs << 'EOF'
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
EOF

echo "✅ Created test-db-connection.mjs"

# Create a simple script to verify the adapter exists
echo ""
echo "📁 Checking file structure..."

ls -la src/lib/db/
ls -la src/app/api/admin/transactions/
ls -la src/app/api/admin/users/
ls -la src/app/api/admin/stats/

# Run the test with proper module resolution
echo ""
echo "🚀 Running database test..."
echo "=========================="

# Use ts-node or node with --loader ts-node if available
if command -v npx &> /dev/null && npx --no-install ts-node --version &> /dev/null; then
    echo "Using ts-node..."
    npx ts-node --esm test-db-connection.mjs
elif command -v node &> /dev/null; then
    echo "Using node with experimental loader..."
    node --loader ts-node/esm test-db-connection.mjs 2>/dev/null || \
    node test-db-connection.mjs
else
    echo "Please install ts-node: npm install -D ts-node"
fi

# Also test the API endpoints directly
echo ""
echo "🌐 Testing API endpoints..."
echo "=========================="

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "Server is running on port 3000"
    
    echo -n "Testing /api/admin/transactions... "
    curl -s http://localhost:3000/api/admin/transactions | head -c 200
    
    echo -e "\n\nTesting /api/admin/users... "
    curl -s http://localhost:3000/api/admin/users | head -c 200
    
    echo -e "\n\nTesting /api/admin/stats... "
    curl -s http://localhost:3000/api/admin/stats | head -c 200
    echo ""
else
    echo "⚠️  Server is not running. Start it with: npm run dev"
fi

echo ""
echo "📋 Next steps:"
echo "1. If the test failed, run: npm install -D ts-node"
echo "2. Then run: node test-db-connection.mjs"
echo "3. Start your server: npm run dev"
echo "4. Visit: http://localhost:3000/admin/transactions"
echo ""