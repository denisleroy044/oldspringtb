import { Pool } from 'pg'
import { randomUUID } from 'crypto'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const db = {
  async getUsers() {
    try {
      // Get users
      const users = await pool.query(`
        SELECT id, email, "firstName", "lastName" 
        FROM public.users
      `);
      
      // For each user, get their accounts with balances
      const usersWithBalance = await Promise.all(users.rows.map(async (user) => {
        const accounts = await pool.query(`
          SELECT id, "accountType", "accountNumber", balance, currency, status 
          FROM public.accounts 
          WHERE "userId" = $1
        `, [user.id]);
        
        const totalBalance = accounts.rows.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
        
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          balance: totalBalance,
          accounts: accounts.rows
        };
      }));
      
      return usersWithBalance;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  async createTransaction(data: {
    userId: string
    type: 'credit' | 'debit'
    amount: number
    description: string
    customDate?: string
  }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Check if user has an account
      let accounts = await client.query(
        'SELECT id FROM public.accounts WHERE "userId" = $1',
        [data.userId]
      );
      
      let accountId;
      if (accounts.rows.length === 0) {
        // Create new account for user
        accountId = randomUUID();
        const accountNumber = '40' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        
        await client.query(
          `INSERT INTO public.accounts (
            id, "userId", "accountType", "accountNumber", balance, currency, status, "createdAt", "updatedAt"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [accountId, data.userId, 'CHECKING', accountNumber, 0, 'USD', 'ACTIVE']
        );
        console.log('✅ Created new account for user');
      } else {
        accountId = accounts.rows[0].id;
      }
      
      // Create transaction with ALL your columns
      const transactionId = randomUUID();
      const now = data.customDate ? new Date(data.customDate) : new Date();
      
      await client.query(
        `INSERT INTO public.transactions (
          id, "userId", "accountId", type, amount, description, category, status, "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          transactionId,
          data.userId,
          accountId,
          data.type,
          data.amount,
          data.description,
          'deposit',
          'completed',
          now,
          now
        ]
      );
      
      // Update account balance
      if (data.type === 'credit') {
        await client.query(
          'UPDATE public.accounts SET balance = balance + $1, "updatedAt" = NOW() WHERE id = $2',
          [data.amount, accountId]
        );
      } else {
        await client.query(
          'UPDATE public.accounts SET balance = balance - $1, "updatedAt" = NOW() WHERE id = $2',
          [data.amount, accountId]
        );
      }
      
      await client.query('COMMIT');
      console.log('✅ Transaction saved to database');
      return { success: true };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  async getTransactions(userId?: string) {
    try {
      const query = userId 
        ? 'SELECT * FROM public.transactions WHERE "userId" = $1 ORDER BY "createdAt" DESC'
        : 'SELECT * FROM public.transactions ORDER BY "createdAt" DESC LIMIT 100';
      
      const params = userId ? [userId] : [];
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
};
