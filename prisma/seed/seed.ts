import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@globalwealthbank.com' },
    update: {},
    create: {
      email: 'admin@globalwealthbank.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      isEmailVerified: true,
    },
  })

  console.log('Created admin user:', admin.email)

  // Create demo user
  const userPassword = await bcrypt.hash('Demo123!', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@globalwealthbank.com' },
    update: {},
    create: {
      email: 'demo@globalwealthbank.com',
      password: userPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'USER',
      isEmailVerified: true,
    },
  })

  console.log('Created demo user:', user.email)

  // Create accounts for demo user
  const checkingAccount = await prisma.account.create({
    data: {
      accountNumber: `CHK${Date.now()}001`,
      accountType: 'CHECKING',
      balance: 5000,
      userId: user.id,
    },
  })

  const savingsAccount = await prisma.account.create({
    data: {
      accountNumber: `SAV${Date.now()}001`,
      accountType: 'SAVINGS',
      balance: 10000,
      userId: user.id,
    },
  })

  console.log('Created demo accounts')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
