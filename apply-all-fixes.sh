# 1. Create missing tables SQL file
cat > create-missing-tables.sql << 'EOF'
-- Create notifications table
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
);

-- Create deposits table
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
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications("isRead");
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications("createdAt");
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits("userId");
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits("status");
CREATE INDEX IF NOT EXISTS idx_deposits_created ON deposits("createdAt");

-- Add sample notifications for demo user (if exists)
DO $$
DECLARE
  demo_user_id TEXT;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    INSERT INTO notifications (id, "userId", type, title, message, "createdAt", "updatedAt")
    VALUES 
      (gen_random_uuid()::TEXT, demo_user_id, 'system', 'Welcome to Oldspring Trust', 'Thank you for banking with us. Your account is now active.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
      (gen_random_uuid()::TEXT, demo_user_id, 'deposit', 'Deposit Confirmed', 'Your initial deposit of $5,000.00 has been processed successfully.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
      (gen_random_uuid()::TEXT, demo_user_id, 'security', 'Security Tip', 'Enable two-factor authentication for enhanced account security.', NOW(), NOW());
  END IF;
END $$;
EOF

echo "✅ Created create-missing-tables.sql"

# 2. Fix notifications API
cat > src/app/api/notifications/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if notifications table exists
    try {
      await query(`SELECT 1 FROM notifications LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ notifications: [] })
    }

    // Get user's notifications
    const result = await query(
      `SELECT 
        id, type, title, message, data, "isRead", "actionUrl", "createdAt"
       FROM notifications
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 20`,
      [payload.userId]
    )

    return NextResponse.json({ 
      notifications: result.rows || [] 
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ 
      notifications: [],
      error: 'Failed to fetch notifications' 
    }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { notificationId } = await req.json()

    await query(
      `UPDATE notifications 
       SET "isRead" = true, "updatedAt" = NOW() 
       WHERE id = $1 AND "userId" = $2`,
      [notificationId, payload.userId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { type, title, message, data, actionUrl } = await req.json()

    const result = await query(
      `INSERT INTO notifications (
        id, "userId", type, title, message, data, "actionUrl", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id`,
      [
        `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        payload.userId,
        type || 'system',
        title,
        message,
        data || null,
        actionUrl || null
      ]
    )

    return NextResponse.json({ success: true, id: result.rows[0].id })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
EOF

echo "✅ Updated notifications API"

# 3. Fix deposits API
cat > src/app/api/deposits/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { amount, method, accountId, cryptoCurrency, senderInfo } = await req.json()

    // Validate amount
    const depositAmount = parseFloat(amount)
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Check if deposits table exists
    try {
      await query(`SELECT 1 FROM deposits LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ 
        error: 'Deposits system is being set up. Please try again in a few minutes.',
        code: 'TABLE_NOT_READY'
      }, { status: 503 })
    }

    // Create deposit request
    const depositId = `dep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    
    const result = await query(
      `INSERT INTO deposits (
        id, "userId", "accountId", amount, method, "cryptoCurrency", 
        "senderInfo", status, "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, amount, method, status, "createdAt"`,
      [
        depositId,
        payload.userId,
        accountId || null,
        depositAmount,
        method,
        cryptoCurrency || null,
        senderInfo || null,
        'PENDING'
      ]
    )

    // Create notification
    try {
      await query(
        `INSERT INTO notifications (
          id, "userId", type, title, message, "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [
          `notif_${Date.now()}`,
          payload.userId,
          'deposit',
          'Deposit Request Submitted',
          `Your ${method} deposit of $${depositAmount} has been submitted and is pending approval.`
        ]
      )
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }

    return NextResponse.json({ 
      success: true,
      deposit: result.rows[0],
      message: 'Deposit request submitted successfully'
    })
  } catch (error: any) {
    console.error('Error creating deposit:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create deposit request' 
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if deposits table exists
    try {
      await query(`SELECT 1 FROM deposits LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ deposits: [] })
    }

    // Get user's deposit requests
    const result = await query(
      `SELECT 
        id, amount, method, status, "transactionId" as reference, "createdAt"
       FROM deposits
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 50`,
      [payload.userId]
    )

    return NextResponse.json({ deposits: result.rows || [] })
  } catch (error) {
    console.error('Error fetching deposits:', error)
    return NextResponse.json({ deposits: [] }, { status: 500 })
  }
}
EOF

echo "✅ Updated deposits API"

# 4. Update database connection with better error handling
cat > src/lib/db/index.ts << 'EOF'
import { Pool } from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

// Log connection string (without password)
const sanitizedUrl = process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@')
console.log('📊 Connecting to database:', sanitizedUrl)

// Create connection pool with better timeout settings for Neon
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false
  }
})

// Helper function to execute queries with error handling
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    if (duration > 1000) {
      console.log('⚠️ Slow query:', { text, duration, rows: res.rowCount })
    }
    return res
  } catch (error: any) {
    console.error('Database query error:', {
      text,
      error: error.message,
      code: error.code
    })
    throw error
  }
}

// Helper to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName]
    )
    return result.rows[0]?.exists || false
  } catch {
    return false
  }
}

// Helper to get user's primary account
export async function getUserPrimaryAccount(userId: string) {
  const result = await query(
    `SELECT id, "accountNumber", balance, "accountType"
     FROM accounts
     WHERE "userId" = $1 AND status = 'ACTIVE'
     ORDER BY "createdAt" ASC
     LIMIT 1`,
    [userId]
  )
  return result.rows[0] || null
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err)
})
EOF

echo "✅ Updated database connection"

# 5. Create verification script
cat > scripts/verify-database.js << 'EOF'
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
EOF

echo "✅ Created verification script"

# 6. Create deposits requests API
cat > src/app/api/deposits/requests/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if deposits table exists
    try {
      await query(`SELECT 1 FROM deposits LIMIT 1`)
    } catch (tableError) {
      return NextResponse.json({ deposits: [] })
    }

    // Get all deposit requests for the user
    const result = await query(
      `SELECT
        id, amount, method, status, "transactionId" as reference, "createdAt"
       FROM deposits
       WHERE "userId" = $1
       ORDER BY "createdAt" DESC`,
      [payload.userId]
    )

    return NextResponse.json({ deposits: result.rows || [] })
  } catch (error) {
    console.error('Error fetching deposit requests:', error)
    return NextResponse.json({ deposits: [] }, { status: 500 })
  }
}
EOF

echo "✅ Created deposits requests API"

# 7. Create deposit detail API
mkdir -p src/app/api/deposits/[id]

cat > src/app/api/deposits/[id]/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { query } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const depositId = params.id

    const result = await query(
      `SELECT 
        id, amount, method, "cryptoCurrency", status, "transactionId" as reference,
        "senderInfo", "adminNotes", "createdAt", "updatedAt", "completedAt"
       FROM deposits
       WHERE id = $1 AND "userId" = $2`,
      [depositId, payload.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    }

    return NextResponse.json({ deposit: result.rows[0] })
  } catch (error) {
    console.error('Error fetching deposit:', error)
    return NextResponse.json({ error: 'Failed to fetch deposit' }, { status: 500 })
  }
}
EOF

echo "✅ Created deposit detail API"

# 8. Create a script to run all fixes
cat > run-all-fixes.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting all fixes for Oldspring Trust Bank"
echo "==============================================="

# Step 1: Create missing tables SQL
echo ""
echo "📦 Step 1: Created create-missing-tables.sql"
echo "   Please run this SQL in your Neon console:"
echo "   cat create-missing-tables.sql | pbcopy  # copies to clipboard"
echo "   Then paste and execute in Neon SQL editor"
echo ""

# Step 2: Update notifications API
echo "📦 Step 2: Updated notifications API"

# Step 3: Update deposits API
echo "📦 Step 3: Updated deposits API"

# Step 4: Update database connection
echo "📦 Step 4: Updated database connection"

# Step 5: Create verification script
echo "📦 Step 5: Created verification script"

# Step 6: Create deposits requests API
echo "📦 Step 6: Created deposits requests API"

# Step 7: Create deposit detail API
echo "📦 Step 7: Created deposit detail API"

echo ""
echo "✅ All files created successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Copy the SQL and run it in Neon:"
echo "      cat create-missing-tables.sql | pbcopy"
echo "      # Then paste in Neon SQL editor and run"
echo ""
echo "   2. Verify the database setup:"
echo "      node scripts/verify-database.js"
echo ""
echo "   3. Restart your development server:"
echo "      npm run dev"
echo ""
echo "   4. Test the deposit page:"
echo "      http://localhost:3000/dashboard/deposit"
echo ""

# Make the script executable
chmod +x run-all-fixes.sh

echo "🎉 Fixes ready! Run ./run-all-fixes.sh to see instructions"
EOF

chmod +x run-all-fixes.sh

echo ""
echo "🎉 ==============================================="
echo "🎉 ALL FIX FILES CREATED SUCCESSFULLY!"
echo "🎉 ==============================================="
echo ""
echo "📋 Files created:"
echo "   ✅ create-missing-tables.sql"
echo "   ✅ src/app/api/notifications/route.ts"
echo "   ✅ src/app/api/deposits/route.ts"
echo "   ✅ src/lib/db/index.ts"
echo "   ✅ scripts/verify-database.js"
echo "   ✅ src/app/api/deposits/requests/route.ts"
echo "   ✅ src/app/api/deposits/[id]/route.ts"
echo "   ✅ run-all-fixes.sh"
echo ""
echo "🚀 To apply all fixes:"
echo "   ./run-all-fixes.sh"
echo ""
echo "This will show you instructions to run the SQL and verify your setup."
echo ""