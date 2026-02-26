import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Only create PrismaClient if DATABASE_URL exists
const prisma = process.env.DATABASE_URL 
  ? (global.prisma || new PrismaClient())
  : null

if (process.env.NODE_ENV !== 'production' && prisma) global.prisma = prisma

export { prisma }
