require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function insertTestCards() {
  try {
    console.log('🔍 Finding demo user...');
    
    // Get demo user ID
    const userRes = await pool.query(
      `SELECT id FROM users WHERE email = 'demo@oldspring.com'`
    );
    
    if (userRes.rows.length === 0) {
      console.log('❌ Demo user not found');
      return;
    }
    
    const userId = userRes.rows[0].id;
    console.log(`✅ Found demo user: ${userId}`);
    
    // Get their checking account
    const accountRes = await pool.query(
      `SELECT id FROM accounts WHERE "userId" = $1 AND "accountType" = 'CHECKING' LIMIT 1`,
      [userId]
    );
    
    const accountId = accountRes.rows[0]?.id;
    
    // Insert a debit card
    await pool.query(`
      INSERT INTO cards (
        id, "userId", "accountId", "cardType", "cardBrand", 
        "cardNumber", "lastFour", "cardholderName", 
        "expiryMonth", "expiryYear", "cvv", 
        status, "isVirtual", "currentBalance", "rewardsPoints"
      ) VALUES (
        gen_random_uuid()::TEXT,
        $1, $2, 'DEBIT', 'VISA',
        '4532015112830366', '0366', 'James Donaldson',
        12, 2028, '123',
        'ACTIVE', false, 5250.00, 1250
      ) ON CONFLICT ("cardNumber") DO NOTHING
    `, [userId, accountId]);
    console.log('✅ Debit card inserted');
    
    // Insert a credit card
    await pool.query(`
      INSERT INTO cards (
        id, "userId", "accountId", "cardType", "cardBrand", 
        "cardNumber", "lastFour", "cardholderName", 
        "expiryMonth", "expiryYear", "cvv", 
        status, "isVirtual", "creditLimit", "availableCredit", "currentBalance", "apr", "rewardsPoints"
      ) VALUES (
        gen_random_uuid()::TEXT,
        $1, NULL, 'CREDIT', 'MASTERCARD',
        '5424180123456789', '6789', 'James Donaldson',
        10, 2027, '456',
        'ACTIVE', false, 10000.00, 6750.75, 3249.25, 18.99, 2450
      ) ON CONFLICT ("cardNumber") DO NOTHING
    `, [userId]);
    console.log('✅ Credit card inserted');
    
    console.log('\n🎉 Test cards inserted successfully!');
    
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

insertTestCards();
