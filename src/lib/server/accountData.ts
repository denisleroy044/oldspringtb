import { prisma } from '../prisma'

// This file can only be imported in Server Components
export async function getAccounts(userId: string) {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAccountDetails(accountId: string) {
  return prisma.account.findUnique({
    where: { id: accountId },
    include: { transactions: { orderBy: { date: 'desc' }, take: 10 } },
  })
}
