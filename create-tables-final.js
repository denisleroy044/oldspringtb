require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  try {
    console.log('🔨 Creating cards and card_requests tables...\n');
    
    // Create cards table (referencing users table)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "accountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
        "cardType" TEXT NOT NULL,
        "cardBrand" TEXT NOT NULL,
        "cardNumber" TEXT NOT NULL UNIQUE,
        "lastFour" TEXT NOT NULL,
        "cardholderName" TEXT NOT NULL,
        "expiryMonth" INTEGER NOT NULL,
        "expiryYear" INTEGER NOT NULL,
        "cvv" TEXT NOT NULL,
        "status" TEXT DEFAULT 'ACTIVE',
        "isVirtual" BOOLEAN DEFAULT false,
        "creditLimit" DECIMAL(10,2),
        "availableCredit" DECIMAL(10,2),
        "currentBalance" DECIMAL(10,2) DEFAULT 0,
        "apr" DECIMAL(5,2),
        "rewardsPoints" INTEGER DEFAULT 0,
        "issuedAt" TIMESTAMP DEFAULT NOW(),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ cards table created');

    // Create card_requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS card_requests (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "accountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
        "cardType" TEXT NOT NULL,
        "cardBrand" TEXT NOT NULL,
        "status" TEXT DEFAULT 'PENDING',
        "adminNotes" TEXT,
        "reviewedBy" TEXT,
        "reviewedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ card_requests table created');

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_cards_user ON cards("userId")');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_cards_account ON cards("accountId")');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_card_requests_user ON card_requests("userId")');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_card_requests_status ON card_requests(status)');
    
    console.log('\n✅ All indexes created');
    console.log('🎉 Tables created successfully!');

  } catch (err) {
    console.error('❌ Error creating tables:', err);
  } finally {
    await pool.end();
  }
}

createTables();
