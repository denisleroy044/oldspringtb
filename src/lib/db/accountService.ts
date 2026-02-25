import { prisma } from '@/lib/prisma'

export interface BankAccount {
  id: string
  name: string
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT'
  balance: number
  accountNumber: string
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED'
}

export async function getUserAccounts(userId: string): Promise<BankAccount[]> {
  try {
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
    return []
  }
}

export async function getAccountById(accountId: string): Promise<BankAccount | null> {
  try {
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
