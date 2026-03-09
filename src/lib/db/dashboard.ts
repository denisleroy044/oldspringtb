import { query } from './index'

export interface DashboardSummary {
  totalBalance: number
  monthlySpending: number
  monthlyIncome: number
  savingsProgress: number
  savingsGoal: number
  accounts: Account[]
  recentTransactions: Transaction[]
  stats: {
    cardsCount: number
    billsDue: number
    overdueBills: number
    rewardsPoints: number
    loanBalance: number
  }
}

export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'investment'
  accountNumber: string
  balance: number
  available?: number
  currency: string
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED'
  createdAt: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: 'credit' | 'debit' | 'transfer'
  category: string
  date: string
  accountId: string
  accountName: string
  status: 'completed' | 'pending' | 'failed'
}

export async function getUserDashboardData(userId: string): Promise<DashboardSummary> {
  try {
    // Get all active accounts for the user
    const accountsRes = await query(
      `SELECT id, name, type, balance, currency, "accountNumber", status, "createdAt"
       FROM accounts 
       WHERE "userId" = $1 AND status = 'ACTIVE'
       ORDER BY "createdAt" ASC`,
      [userId]
    )

    const accounts: Account[] = accountsRes.rows.map(acc => ({
      id: acc.id,
      name: acc.name,
      type: acc.type.toLowerCase(),
      accountNumber: maskAccountNumber(acc.accountNumber),
      balance: parseFloat(acc.balance),
      currency: acc.currency,
      status: acc.status,
      createdAt: acc.createdAt
    }))

    // Calculate total balance (credit card balances are considered negative)
    const totalBalance = accounts.reduce((sum, acc) => {
      if (acc.type === 'credit') {
        return sum - Math.abs(acc.balance)
      }
      return sum + acc.balance
    }, 0)

    // Get recent transactions (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const transactionsRes = await query(
      `SELECT t.id, t.description, t.amount, t.type, t.category, t.date, 
              t.status, a.name as "accountName", a.id as "accountId"
       FROM transactions t
       JOIN accounts a ON t."accountId" = a.id
       WHERE a."userId" = $1 AND t.date >= $2
       ORDER BY t.date DESC
       LIMIT 10`,
      [userId, thirtyDaysAgo.toISOString()]
    )

    const recentTransactions: Transaction[] = transactionsRes.rows.map(t => ({
      id: t.id,
      description: t.description,
      amount: parseFloat(t.amount),
      type: t.type.toLowerCase(),
      category: t.category,
      date: formatDate(t.date),
      accountId: t.accountId,
      accountName: t.accountName,
      status: t.status.toLowerCase()
    }))

    // Calculate monthly spending and income
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const monthlyStatsRes = await query(
      `SELECT 
        SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as spending,
        SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as income
       FROM transactions t
       JOIN accounts a ON t."accountId" = a.id
       WHERE a."userId" = $1 AND t.date >= $2`,
      [userId, currentMonth.toISOString()]
    )

    const monthlySpending = parseFloat(monthlyStatsRes.rows[0]?.spending || 0)
    const monthlyIncome = parseFloat(monthlyStatsRes.rows[0]?.income || 0)

    // Get savings goal (you'll need to add this to your user preferences)
    const savingsGoal = 10000 // Default, can be user-configurable
    const savingsAccount = accounts.find(a => a.type === 'savings')
    const savingsProgress = savingsAccount ? (savingsAccount.balance / savingsGoal) * 100 : 0

    // Get stats
    const cardsCount = accounts.filter(a => a.type === 'credit').length
    const loanBalance = accounts
      .filter(a => a.type === 'credit')
      .reduce((sum, a) => sum + Math.abs(a.balance), 0)

    // Get bills due
    const billsDue = await getBillsDue(userId)

    return {
      totalBalance,
      monthlySpending,
      monthlyIncome,
      savingsProgress,
      savingsGoal,
      accounts,
      recentTransactions,
      stats: {
        cardsCount,
        billsDue: billsDue.total,
        overdueBills: billsDue.overdue,
        rewardsPoints: 2450, // You'll need to implement rewards points
        loanBalance
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw error
  }
}

async function getBillsDue(userId: string): Promise<{ total: number; overdue: number }> {
  try {
    const billsRes = await query(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue
       FROM bills
       WHERE "userId" = $1 AND status IN ('pending', 'overdue')`,
      [userId]
    )

    return {
      total: parseInt(billsRes.rows[0]?.total || 0),
      overdue: parseInt(billsRes.rows[0]?.overdue || 0)
    }
  } catch {
    return { total: 0, overdue: 0 }
  }
}

function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber) return ''
  const lastFour = accountNumber.slice(-4)
  return `**** ${lastFour}`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}
