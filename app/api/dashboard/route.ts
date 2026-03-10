import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { cookies } from 'next/headers'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    console.log('📊 Dashboard API called')
    
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    console.log('User ID from cookie:', userId)

    if (!userId) {
      console.log('No userId cookie found')
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user details
    const userResult = await pool.query(
      'SELECT "firstName", "lastName", email FROM public.users WHERE id = $1',
      [userId]
    )
    
    if (userResult.rows.length === 0) {
      console.log('User not found:', userId)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = userResult.rows[0]

    // Get accounts
    let accounts = []
    try {
      const accountsResult = await pool.query(
        `SELECT id, "accountType", "accountNumber", balance, currency, status 
         FROM public.accounts 
         WHERE "userId" = $1`,
        [userId]
      )
      
      accounts = accountsResult.rows.map(acc => ({
        id: acc.id,
        accountType: acc.accountType || 'CHECKING',
        displayName: acc.accountType === 'CHECKING' ? 'Checking Account' : 
                     acc.accountType === 'SAVINGS' ? 'Savings Account' : 
                     acc.accountType || 'Account',
        accountNumber: acc.accountNumber || '',
        maskedNumber: acc.accountNumber ? '****' + acc.accountNumber.slice(-4) : '****0000',
        balance: parseFloat(acc.balance) || 0,
        currency: acc.currency || 'USD'
      }))
      
    } catch (err) {
      console.error('Error fetching accounts:', err)
    }

    // Get all transactions for this user
    let transactions = []
    try {
      const transactionsResult = await pool.query(
        `SELECT id, description, amount, type, status, "createdAt" as date 
         FROM public.transactions 
         WHERE "userId" = $1 
         ORDER BY "createdAt" DESC`,
        [userId]
      )
      
      transactions = transactionsResult.rows.map(tx => ({
        id: tx.id,
        description: tx.description || 'Transaction',
        amount: parseFloat(tx.amount) || 0,
        type: tx.type || 'credit',
        status: tx.status || 'completed',
        date: tx.date || new Date().toISOString()
      }))
      
      console.log(`Found ${transactions.length} total transactions`)
    } catch (err) {
      console.error('Error fetching transactions:', err)
    }

    // Calculate totals
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
    
    // Calculate monthly spending (current month - using zero-based months)
    const now = new Date()
    const currentMonth = now.getMonth() // March = 2 (not 3!)
    const currentYear = now.getFullYear()
    
    // For debugging, let's log all transactions with their dates
    console.log('All transactions:')
    transactions.forEach(tx => {
      const txDate = new Date(tx.date)
      console.log(`  - ${tx.description}: ${tx.type} $${tx.amount} on ${txDate.toLocaleDateString()} (month: ${txDate.getMonth()}, year: ${txDate.getFullYear()})`)
    })
    
    console.log(`Current month (zero-based): ${currentMonth} which is month ${currentMonth + 1}`)
    
    const monthlyIncome = transactions
      .filter(tx => {
        const txDate = new Date(tx.date)
        const match = tx.type === 'credit' && 
                      txDate.getMonth() === currentMonth && 
                      txDate.getFullYear() === currentYear
        if (match) console.log(`✓ Income: ${tx.description} $${tx.amount}`)
        return match
      })
      .reduce((sum, tx) => sum + tx.amount, 0)
    
    const monthlySpending = transactions
      .filter(tx => {
        const txDate = new Date(tx.date)
        const match = tx.type === 'debit' && 
                      txDate.getMonth() === currentMonth && 
                      txDate.getFullYear() === currentYear
        if (match) console.log(`✓ Spending: ${tx.description} $${tx.amount}`)
        return match
      })
      .reduce((sum, tx) => sum + tx.amount, 0)

    console.log(`Current month: ${currentMonth + 1}/${currentYear}`)
    console.log('Monthly Income:', monthlyIncome)
    console.log('Monthly Spending:', monthlySpending)

    const dashboardData = {
      user: {
        firstName: user.firstName || 'User',
        lastName: user.lastName || '',
        email: user.email || ''
      },
      accounts,
      recentTransactions: transactions.slice(0, 10),
      totals: {
        totalBalance,
        monthlyIncome,
        monthlySpending,
        accountCount: accounts.length
      }
    }

    console.log('✅ Dashboard data sent:', {
      accounts: accounts.length,
      transactions: transactions.length,
      totalBalance,
      monthlyIncome,
      monthlySpending
    })
    
    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('❌ Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
}
