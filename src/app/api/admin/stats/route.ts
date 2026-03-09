import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    // Get user count
    const users = await pool.query('SELECT COUNT(*) FROM public.users');
    
    // Get account stats
    const accounts = await pool.query(`
      SELECT 
        COUNT(*) as count,
        COALESCE(SUM(balance), 0) as total_balance
      FROM public.accounts
    `);
    
    // Get transaction stats
    const transactions = await pool.query(`
      SELECT 
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_volume
      FROM public.transactions
    `);
    
    const stats = {
      totalUsers: parseInt(users.rows[0].count) || 0,
      totalAccounts: parseInt(accounts.rows[0].count) || 0,
      totalBalance: parseFloat(accounts.rows[0].total_balance) || 0,
      totalTransactions: parseInt(transactions.rows[0].count) || 0,
      totalVolume: parseFloat(transactions.rows[0].total_volume) || 0,
      newUsers: 0,
      recentTransactions: 0,
      totalCredits: 0,
      totalDebits: 0,
      pendingLoans: 0,
      pendingGrants: 0,
      openTickets: 0,
      activeChats: 0
    };
    
    console.log('📊 Stats:', stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      totalUsers: 0,
      totalAccounts: 0,
      totalBalance: 0,
      totalTransactions: 0,
      totalVolume: 0,
      newUsers: 0,
      recentTransactions: 0,
      totalCredits: 0,
      totalDebits: 0,
      pendingLoans: 0,
      pendingGrants: 0,
      openTickets: 0,
      activeChats: 0
    });
  }
}
