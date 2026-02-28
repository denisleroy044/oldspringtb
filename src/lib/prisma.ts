import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Determine which configuration to use
const prismaClientSingleton = () => {
  // Check if we have Accelerate URL (production)
  if (process.env.DATABASE_URL__ACCELERATE) {
    console.log('🚀 Using Prisma Accelerate')
    return new PrismaClient({
      log: ['error'],
      accelerateUrl: process.env.DATABASE_URL__ACCELERATE,
    })
  }
  
  // For development, we need to use a driver adapter
  console.log('💻 Using direct database connection with driver adapter')
  // Note: In Prisma 7, you still need an adapter even for direct connections
  // For Neon, we need to use the Neon adapter
  const { neon } = require('@neondatabase/serverless')
  const { PrismaNeon } = require('@prisma/adapter-neon')
  
  const sql = neon(process.env.DATABASE_URL)
  const adapter = new PrismaNeon(sql)
  
  return new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
