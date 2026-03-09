require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testTransactions() {
  try {
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
    
    // Test the query we'll use in the API
    const queryText = `
      SELECT 
        t.id,
        t.description,
        t.amount,
        t.type,
        t.status,
        t.reference,
        t."createdAt" as date,
        t."senderAccountId",
        t."receiverAccountId",
        CASE 
          WHEN t.type = 'DEPOSIT' THEN 'credit'
          WHEN t.type = 'WITHDRAWAL' THEN 'debit'
          WHEN t.type = 'PAYMENT' THEN 'debit'
          WHEN t.type = 'TRANSFER' THEN 'transfer'
          ELSE 'debit'
        END as "transactionType",
        CASE
          WHEN t.type = 'DEPOSIT' THEN (
            SELECT a."accountType" FROM accounts a WHERE a.id = t."receiverAccountId"
          )
          WHEN t.type = 'WITHDRAWAL' THEN (
            SELECT a."accountType" FROM accounts a WHERE a.id = t."senderAccountId"
          )
          WHEN t.type = 'PAYMENT' THEN (
            SELECT a."accountType" FROM accounts a WHERE a.id = t."senderAccountId"
          )
          WHEN t.type = 'TRANSFER' THEN (
            SELECT a."accountType" FROM accounts a WHERE a.id = t."senderAccountId"
          )
        END as "accountType"
      FROM transactions t
      WHERE t."userId" = $1
      LIMIT 5
    `;
    
    const res = await pool.query(queryText, [userId]);
    console.log('\n📊 Transactions found:', res.rows.length);
    res.rows.forEach((t, i) => {
      console.log(`\n--- Transaction ${i + 1} ---`);
      console.log('Description:', t.description);
      console.log('Amount:', t.amount);
      console.log('Type:', t.type);
      console.log('Transaction Type:', t.transactionType);
      console.log('Account Type:', t.accountType);
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

testTransactions();
