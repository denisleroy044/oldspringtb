require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createTransactions() {
  try {
    console.log('🔍 Checking for demo user...');
    
    // Get demo user
    const userRes = await pool.query(
      `SELECT id FROM users WHERE email = 'demo@oldspring.com'`
    );

    if (userRes.rows.length === 0) {
      console.log('❌ Demo user not found');
      return;
    }

    const userId = userRes.rows[0].id;
    console.log('✅ Found demo user:', userId);
    
    // Get user's checking account
    const accountRes = await pool.query(
      `SELECT id FROM accounts WHERE "userId" = $1 AND "accountType" = 'CHECKING' LIMIT 1`,
      [userId]
    );
    
    if (accountRes.rows.length === 0) {
      console.log('❌ No checking account found');
      return;
    }
    
    const accountId = accountRes.rows[0].id;
    console.log('✅ Found checking account:', accountId);
    
    // Check if transactions already exist
    const txCount = await pool.query(
      `SELECT COUNT(*) FROM transactions WHERE "userId" = $1`,
      [userId]
    );
    
    if (parseInt(txCount.rows[0].count) > 0) {
      console.log('✅ Transactions already exist');
      return;
    }
    
    console.log('📝 Creating sample transactions...');
    
    const crypto = require('crypto');
    const now = new Date();
    
    const sampleTransactions = [
      { description: 'Salary Deposit', amount: 3500.00, type: 'DEPOSIT', daysAgo: 2 },
      { description: 'Amazon.com', amount: 89.99, type: 'PAYMENT', daysAgo: 3 },
      { description: 'Whole Foods Market', amount: 156.78, type: 'PAYMENT', daysAgo: 5 },
      { description: 'Netflix Subscription', amount: 15.99, type: 'PAYMENT', daysAgo: 7 },
      { description: 'Uber Ride', amount: 24.50, type: 'PAYMENT', daysAgo: 8 },
      { description: 'Electric Bill', amount: 145.67, type: 'PAYMENT', daysAgo: 10 },
      { description: 'Transfer to Savings', amount: 500.00, type: 'TRANSFER', daysAgo: 12 },
      { description: 'Starbucks', amount: 12.45, type: 'PAYMENT', daysAgo: 14 },
      { description: 'Dividend Payment', amount: 45.67, type: 'DEPOSIT', daysAgo: 15 },
      { description: 'Target', amount: 67.89, type: 'PAYMENT', daysAgo: 18 }
    ];
    
    for (const tx of sampleTransactions) {
      const txDate = new Date(now);
      txDate.setDate(txDate.getDate() - tx.daysAgo);
      
      await pool.query(
        `INSERT INTO transactions (
          id, "userId", "accountId", type, amount, description, 
          status, reference, "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)`,
        [
          crypto.randomUUID(),
          userId,
          accountId,
          tx.type,
          tx.amount,
          tx.description,
          'COMPLETED',
          `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          txDate
        ]
      );
    }
    
    console.log('✅ Sample transactions created successfully!');
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

createTransactions();
