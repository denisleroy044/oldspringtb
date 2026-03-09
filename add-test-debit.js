const { Pool } = require('pg');
const { randomUUID } = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addTestDebit() {
  try {
    const userId = '46c8c073-7817-4ce4-af9b-b6e74bb21b75';
    
    // Get user's account
    const accountResult = await pool.query(
      'SELECT id, balance FROM public.accounts WHERE "userId" = $1 LIMIT 1',
      [userId]
    );
    
    if (accountResult.rows.length === 0) {
      console.log('❌ No account found for user');
      return;
    }
    
    const accountId = accountResult.rows[0].id;
    const currentBalance = parseFloat(accountResult.rows[0].balance);
    const debitAmount = 250.00;
    
    console.log('📊 Current balance:', currentBalance);
    console.log('💰 Debit amount:', debitAmount);
    
    // Create transaction
    const transactionId = randomUUID();
    const now = new Date();
    
    await pool.query(
      `INSERT INTO public.transactions 
       (id, "userId", "accountId", type, amount, description, category, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        transactionId,
        userId,
        accountId,
        'debit',
        debitAmount,
        'Walmart Shopping',
        'shopping',
        'completed',
        now,
        now
      ]
    );
    
    console.log('✅ Test debit transaction created: $250.00');
    
    // Update account balance
    await pool.query(
      'UPDATE public.accounts SET balance = balance - $1, "updatedAt" = NOW() WHERE id = $2',
      [debitAmount, accountId]
    );
    
    console.log('✅ Account balance updated');
    console.log('💰 New balance:', currentBalance - debitAmount);
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

addTestDebit();
