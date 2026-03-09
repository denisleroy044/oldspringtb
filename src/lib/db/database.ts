import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database operations using Prisma
export const db = {
  // Users
  async getUsers() {
    return prisma.user.findMany({
      include: {
        accounts: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    })
  },

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    })
  },

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    })
  },

  async updateUser(id: string, data: Partial<any>) {
    return prisma.user.update({
      where: { id },
      data,
      include: { accounts: true }
    })
  },

  // Transactions
  async getTransactions(limit = 100, userId?: string) {
    const where = userId ? { userId } : {}
    
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            name: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return transactions.map(t => ({
      ...t,
      userEmail: t.user?.email,
      userName: t.user?.name || `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim()
    }))
  },

  async createTransaction(data: {
    userId: string
    accountId?: string
    type: 'credit' | 'debit'
    amount: number
    description: string
    status?: 'pending' | 'completed' | 'failed'
    reference?: string
    metadata?: any
  }) {
    // Start a transaction to ensure data consistency
    return prisma.$transaction(async (tx) => {
      // Create the transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          accountId: data.accountId,
          type: data.type,
          amount: data.amount,
          description: data.description,
          status: data.status || 'completed',
          reference: data.reference,
          metadata: data.metadata,
          currency: 'USD'
        }
      })

      // Update user balance
      if (data.status !== 'failed') {
        const user = await tx.user.findUnique({
          where: { id: data.userId }
        })

        if (user) {
          const newBalance = data.type === 'credit' 
            ? user.balance + data.amount 
            : user.balance - data.amount

          await tx.user.update({
            where: { id: data.userId },
            data: { 
              balance: newBalance,
              total_deposits: data.type === 'credit' 
                ? { increment: data.amount }
                : undefined
            }
          })
        }
      }

      return transaction
    })
  },

  // Stats
  async getStats() {
    const [
      totalUsers,
      activeUsers,
      totalTransactions,
      totalVolume,
      pendingLoans,
      pendingGrants
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.transaction.count(),
      prisma.transaction.aggregate({ _sum: { amount: true } }),
      prisma.loan?.count({ where: { status: 'pending' } }) || Promise.resolve(0),
      prisma.grant?.count({ where: { status: 'pending' } }) || Promise.resolve(0)
    ])

    return {
      totalUsers,
      activeUsers,
      totalTransactions,
      totalVolume: totalVolume._sum.amount || 0,
      pendingLoans: pendingLoans || 0,
      pendingGrants: pendingGrants || 0,
      openTickets: 0,
      activeChats: 0
    }
  },

  // Notifications (using your existing auth service)
  async addNotification(userId: string, notification: any) {
    // You can integrate with your existing notification system here
    // For now, we'll just log it
    console.log('Notification:', { userId, ...notification })
    return true
  }
}
