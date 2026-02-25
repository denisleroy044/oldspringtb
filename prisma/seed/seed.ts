import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create test users
  const userPassword = await bcrypt.hash('password123', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  // Create regular user
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER',
      twoFactorEnabled: false,
      phone: '+1234567890',
      preferences: {
        create: {
          emailEnabled: true,
          pushEnabled: true,
          smsEnabled: false,
          theme: 'light'
        }
      }
    }
  })

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@oldspring.com' },
    update: {},
    create: {
      email: 'admin@oldspring.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      twoFactorEnabled: true,
      phone: '+1987654321',
      preferences: {
        create: {
          emailEnabled: true,
          pushEnabled: true,
          smsEnabled: true,
          theme: 'dark'
        }
      }
    }
  })

  // Create sample accounts
  const user = await prisma.user.findUnique({
    where: { email: 'user@example.com' }
  })

  if (user) {
    await prisma.account.createMany({
      data: [
        {
          name: 'Primary Checking',
          type: 'CHECKING',
          balance: 5280.42,
          currency: 'USD',
          accountNumber: '****1234',
          status: 'ACTIVE',
          userId: user.id
        },
        {
          name: 'High-Yield Savings',
          type: 'SAVINGS',
          balance: 12750.89,
          currency: 'USD',
          accountNumber: '****5678',
          status: 'ACTIVE',
          userId: user.id
        },
        {
          name: 'Rewards Credit Card',
          type: 'CREDIT',
          balance: -3249.25,
          currency: 'USD',
          accountNumber: '****9012',
          status: 'ACTIVE',
          userId: user.id
        }
      ]
    })

    // Get the checking account for transactions
    const checkingAccount = await prisma.account.findFirst({
      where: { userId: user.id, type: 'CHECKING' }
    })

    if (checkingAccount) {
      // Create sample transactions
      await prisma.transaction.createMany({
        data: [
          {
            date: new Date('2024-03-15'),
            description: 'Salary Deposit',
            amount: 3500.00,
            type: 'CREDIT',
            category: 'Income',
            status: 'COMPLETED',
            accountId: checkingAccount.id
          },
          {
            date: new Date('2024-03-14'),
            description: 'Whole Foods Market',
            amount: -156.78,
            type: 'DEBIT',
            category: 'Groceries',
            status: 'COMPLETED',
            accountId: checkingAccount.id
          },
          {
            date: new Date('2024-03-13'),
            description: 'Netflix Subscription',
            amount: -15.99,
            type: 'DEBIT',
            category: 'Entertainment',
            status: 'COMPLETED',
            accountId: checkingAccount.id
          }
        ]
      })
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
