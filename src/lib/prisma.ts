import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create PrismaClient if DATABASE_URL exists
export const prisma = process.env.DATABASE_URL 
  ? (globalForPrisma.prisma ?? new PrismaClient())
  : null

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma
