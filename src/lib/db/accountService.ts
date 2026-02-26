import { prisma } from '@/lib/prisma'

export interface BankAccount {
  id: string
  name: string
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT'
  balance: number
  accountNumber: string
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED'
}

// Mock data for when database is not available
const mockAccounts: BankAccount[] = [
  {
    id: '1',
    name: 'Primary Checking',
    type: 'CHECKING',
    balance: 5280.42,
    accountNumber: '****1234',
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: 'High-Yield Savings',
    type: 'SAVINGS',
    balance: 12750.89,
    accountNumber: '****5678',
    status: 'ACTIVE'
  }
]

export async function getUserAccounts(userId: string): Promise<BankAccount[]> {
  try {
    // If prisma is not available (no DATABASE_URL or during build), return mock data
    if (!prisma) {
      console.log('Database not connected, using mock account data')
      return mockAccounts
    }

    const accounts = await prisma.account.findMany({
      where: {
        userId: userId
      }
    })

    return accounts.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type as any,
      balance: a.balance,
      accountNumber: a.accountNumber,
      status: a.status as any
    }))
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return mockAccounts
  }
}

export async function getAccountById(accountId: string): Promise<BankAccount | null> {
  try {
    if (!prisma) {
      return mockAccounts.find(a => a.id === accountId) || null
    }

    const account = await prisma.account.findUnique({
      where: {
        id: accountId
      }
    })

    if (!account) return null

    return {
      id: account.id,
      name: account.name,
      type: account.type as any,
      balance: account.balance,
      accountNumber: account.accountNumber,
      status: account.status as any
    }
  } catch (error) {
    console.error('Error fetching account:', error)
    return null
  }
}
