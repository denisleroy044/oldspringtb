require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkTransactions() {
  try {
    // Get demo user
    const userRes = await pool.query(
      `SELECT id, email, "firstName", "lastName" FROM users WHERE email = 'demo@oldspring.com'`
    );
    
    if (userRes.rows.length === 0) {
      console.log('❌ Demo user not found');
      return;
    }
    
    const user = userRes.rows[0];
    console.log('👤 User:', user.firstName, user.lastName);
    
    // Get user's accounts
    const accountsRes = await pool.query(
      `SELECT id, "accountType", "accountNumber", balance FROM accounts WHERE "userId" = $1`,
      [user.id]
    );
    
    console.log('\n💰 Accounts:');
    accountsRes.rows.forEach(acc => {
      console.log(`   - ${acc.accountType}: ${acc.accountNumber} ($${acc.balance})`);
    });
    
    // Get user's transactions
    const transactionsRes = await pool.query(
      `SELECT t.*, a."accountType" as account_type, a."accountNumber" as account_number
       FROM transactions t
       JOIN accounts a ON t."accountId" = a.id
       WHERE t."userId" = $1
       ORDER BY t."createdAt" DESC
       LIMIT 10`,
      [user.id]
    );
    
    console.log('\n📊 Recent Transactions:');
    if (transactionsRes.rows.length === 0) {
      console.log('   No transactions found');
      
      // Create some sample transactions
      console.log('\n🔨 Creating sample transactions...');
      
      const checkingAccount = accountsRes.rows.find(a => a.accountType === 'CHECKING');
      if (checkingAccount) {
        const crypto = require('crypto');
        
        const sampleTransactions = [
          { description: 'Salary Deposit', amount: 3500.00, type: 'DEPOSIT' },
          { description: 'Amazon.com', amount: 89.99, type: 'PAYMENT' },
          { description: 'Whole Foods Market', amount: 156.78, type: 'PAYMENT' },
          { description: 'Netflix Subscription', amount: 15.99, type: 'PAYMENT' },
          { description: 'Uber Ride', amount: 24.50, type: 'PAYMENT' },
          { description: 'Transfer to Savings', amount: 500.00, type: 'TRANSFER' }
        ];
        
        for (const tx of sampleTransactions) {
          await pool.query(
            `INSERT INTO transactions (id, "userId", "accountId", type, amount, description, status, reference, "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - (random() * interval '30 days'), NOW())`,
            [
              crypto.randomUUID(),
              user.id,
              checkingAccount.id,
              tx.type,
              tx.amount,
              tx.description,
              'COMPLETED',
              `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
            ]
          );
        }
        console.log('✅ Sample transactions created');
      }
    } else {
      transactionsRes.rows.forEach(tx => {
        console.log(`   ${tx.createdAt.toISOString().split('T')[0]}: ${tx.description} - $${tx.amount} (${tx.type})`);
      });
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

checkTransactions();
