import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Check if we have the Accelerate URL (production)
const getPrismaClient = () => {
  if (process.env.DATABASE_URL__ACCELERATE) {
    console.log('🚀 Using Prisma Accelerate in production')
    return new PrismaClient({
      log: ['error'],
      // @ts-ignore - Accelerate URL is supported in Prisma 7
      accelerateUrl: process.env.DATABASE_URL__ACCELERATE,
    })
  }

  // Development or fallback - use standard client
  console.log('💻 Using standard Prisma client')
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
