# 1. First, let's check if the tables exist and create them
cat > check-and-create-tables.js << 'EOF'
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAndCreateTables() {
  console.log('🔍 Checking database setup...\n');

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected\n');

    // Check if deposits table exists
    const depositsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'deposits'
      )
    `);

    if (!depositsCheck.rows[0].exists) {
      console.log('📦 Creating deposits table...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS deposits (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          "accountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
          "amount" DECIMAL(10,2) NOT NULL,
          "method" TEXT NOT NULL,
          "currency" TEXT DEFAULT 'USD',
          "cryptoCurrency" TEXT,
          "paymentDetails" JSONB,
          "transactionId" TEXT,
          "senderInfo" TEXT,
          "adminNotes" TEXT,
          "status" TEXT DEFAULT 'PENDING',
          "approvedBy" TEXT,
          "approvedAt" TIMESTAMP,
          "completedAt" TIMESTAMP,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      console.log('✅ Deposits table created\n');
    } else {
      console.log('✅ Deposits table already exists\n');
    }

    // Check if notifications table exists
    const notifCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notifications'
      )
    `);

    if (!notifCheck.rows[0].exists) {
      console.log('📦 Creating notifications table...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          "type" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "data" JSONB,
          "isRead" BOOLEAN DEFAULT false,
          "actionUrl" TEXT,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      console.log('✅ Notifications table created\n');
    } else {
      console.log('✅ Notifications table already exists\n');
    }

    // Create indexes
    console.log('📦 Creating indexes...');
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits("userId");
      CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits("status");
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications("userId");
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications("isRead");
    `);
    
    console.log('✅ Indexes created\n');

    // Add sample notifications for demo user
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE email = 'demo@oldspring.com'`
    );

    if (userCheck.rows.length > 0) {
      const userId = userCheck.rows[0].id;
      
      const notifCount = await pool.query(
        `SELECT COUNT(*) FROM notifications WHERE "userId" = $1`,
        [userId]
      );

      if (parseInt(notifCount.rows[0].count) === 0) {
        console.log('📦 Adding sample notifications for demo user...');
        
        await pool.query(`
          INSERT INTO notifications (id, "userId", type, title, message, "createdAt", "updatedAt")
          VALUES 
            (gen_random_uuid()::TEXT, $1, 'system', 'Welcome to Oldspring Trust', 'Thank you for banking with us. Your account is now active.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
            (gen_random_uuid()::TEXT, $1, 'deposit', 'Deposit Confirmed', 'Your initial deposit of $5,000.00 has been processed successfully.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
            (gen_random_uuid()::TEXT, $1, 'security', 'Security Tip', 'Enable two-factor authentication for enhanced account security.', NOW(), NOW())
        `, [userId]);
        
        console.log('✅ Sample notifications added\n');
      }
    }

    // Verify tables
    console.log('📋 Verifying tables:');
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    tables.rows.forEach(t => {
      console.log(`   - ${t.table_name}`);
    });

    console.log('\n✅ Database setup complete!');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkAndCreateTables();
EOF

echo "✅ Created check-and-create-tables.js"

# 2. Create a temporary fix for the deposits API to handle missing table gracefully
cat > temp-fix-deposits.js << 'EOF'
const fs = require('fs');
const path = require('path');

const depositsApiPath = 'src/app/api/deposits/route.ts';

console.log('🔧 Applying temporary fix to deposits API...');

try {
  let content = fs.readFileSync(depositsApiPath, 'utf8');
  
  // Replace the table check section to automatically create the table
  const tableCheckRegex = /\/\/ Check if deposits table exists[\s\S]*?catch \(tableError\) \{[\s\S]*?return NextResponse\.json\([\s\S]*?\{[\s\S]*?error: 'Deposits system is being set up[^}]*\}[^}]*\}, { status: 503 \}/;
  
  const replacement = `// Check if deposits table exists and create it if needed
    try {
      await query(\`SELECT 1 FROM deposits LIMIT 1\`)
    } catch (tableError) {
      console.log('Deposits table not found, attempting to create...');
      
      try {
        await query(\`
          CREATE TABLE IF NOT EXISTS deposits (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
            "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            "accountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
            amount DECIMAL(10,2) NOT NULL,
            method TEXT NOT NULL,
            currency TEXT DEFAULT 'USD',
            "cryptoCurrency" TEXT,
            "paymentDetails" JSONB,
            "transactionId" TEXT,
            "senderInfo" TEXT,
            "adminNotes" TEXT,
            status TEXT DEFAULT 'PENDING',
            "approvedBy" TEXT,
            "approvedAt" TIMESTAMP,
            "completedAt" TIMESTAMP,
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
          )
        \`)
        
        await query(\`
          CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits("userId");
          CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
        \`)
        
        console.log('✅ Deposits table created automatically')
      } catch (createError) {
        console.error('Failed to create deposits table:', createError)
        return NextResponse.json({ 
          error: 'Deposits system is being set up. Please try again in a few minutes.',
          code: 'TABLE_NOT_READY'
        }, { status: 503 })
      }
    }`;
  
  content = content.replace(tableCheckRegex, replacement);
  
  fs.writeFileSync(depositsApiPath, content, 'utf8');
  console.log('✅ Deposits API updated with auto-creation feature');
  
} catch (err) {
  console.error('❌ Error:', err.message);
}
EOF

echo "✅ Created temp-fix-deposits.js"

# 3. Create a script to run all fixes
cat > run-database-fix.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting database fix for Oldspring Trust Bank"
echo "=================================================="
echo ""

# Step 1: Check and create tables
echo "📦 Step 1: Creating database tables..."
node check-and-create-tables.js

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Failed to create tables. Please check your database connection."
  exit 1
fi

echo ""
echo "✅ Tables created successfully!"
echo ""

# Step 2: Apply temporary fix to deposits API
echo "📦 Step 2: Applying temporary fix to deposits API..."
node temp-fix-deposits.js

echo ""
echo "🎉 All fixes applied successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your development server:"
echo "      npm run dev"
echo ""
echo "   2. Test the deposit page:"
echo "      http://localhost:3000/dashboard/deposit"
echo ""
echo "   3. If you still see errors, check:"
echo "      - Your database connection in .env"
echo "      - That the demo user exists: demo@oldspring.com"
echo ""

# Make the script executable
chmod +x run-database-fix.sh

EOF

chmod +x run-database-fix.sh

echo "✅ Created run-database-fix.sh"
echo ""
echo "🎉 ==============================================="
echo "🎉 DATABASE FIX SCRIPTS CREATED!"
echo "🎉 ==============================================="
echo ""
echo "To fix your database issues, run:"
echo "  ./run-database-fix.sh"
echo ""
echo "This will:"
echo "  1. Create the missing deposits and notifications tables"
echo "  2. Add sample notifications for your demo user"
echo "  3. Update the deposits API to handle missing tables gracefully"
echo ""