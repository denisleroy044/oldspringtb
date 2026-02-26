import { prisma } from '@/lib/prisma'

export interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  type: 'CREDIT' | 'DEBIT'
  category: string
  accountId: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
}

// Mock data for when database is not available
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2024-03-15'),
    description: 'Salary Deposit',
    amount: 3500.00,
    type: 'CREDIT',
    category: 'Income',
    accountId: '1',
    status: 'COMPLETED'
  },
  {
    id: '2',
    date: new Date('2024-03-14'),
    description: 'Whole Foods Market',
    amount: 156.78,
    type: 'DEBIT',
    category: 'Groceries',
    accountId: '1',
    status: 'COMPLETED'
  }
]

export async function getUserTransactions(userId: string, limit: number = 10): Promise<Transaction[]> {
  try {
    // If prisma is not available, return mock data
    if (!prisma) {
      console.log('Database not connected, using mock transaction data')
      return mockTransactions.slice(0, limit)
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        account: {
          userId: userId
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit,
      include: {
        account: true
      }
    })

    return transactions.map(t => ({
      id: t.id,
      date: t.date,
      description: t.description,
      amount: t.amount,
      type: t.amount > 0 ? 'CREDIT' : 'DEBIT',
      category: t.category || 'Other',
      accountId: t.accountId,
      status: t.status as any
    }))
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return mockTransactions.slice(0, limit)
  }
}

export async function getAccountTransactions(accountId: string, limit: number = 20): Promise<Transaction[]> {
  try {
    // If prisma is not available, return mock data filtered by accountId
    if (!prisma) {
      console.log('Database not connected, using mock transaction data')
      return mockTransactions
        .filter(t => t.accountId === accountId)
        .slice(0, limit)
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        accountId: accountId
      },
      orderBy: {
        date: 'desc'
      },
      take: limit
    })

    return transactions.map(t => ({
      id: t.id,
      date: t.date,
      description: t.description,
      amount: t.amount,
      type: t.amount > 0 ? 'CREDIT' : 'DEBIT',
      category: t.category || 'Other',
      accountId: t.accountId,
      status: t.status as any
    }))
  } catch (error) {
    console.error('Error fetching account transactions:', error)
    return mockTransactions
      .filter(t => t.accountId === accountId)
      .slice(0, limit)
  }
}
