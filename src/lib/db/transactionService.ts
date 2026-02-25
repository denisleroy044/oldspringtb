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

export async function getUserTransactions(userId: string, limit: number = 10): Promise<Transaction[]> {
  try {
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
    return []
  }
}

export async function getAccountTransactions(accountId: string, limit: number = 20): Promise<Transaction[]> {
  try {
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
    return []
  }
}
