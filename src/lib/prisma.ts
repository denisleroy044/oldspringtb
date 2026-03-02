import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use environment variable with a fallback
const databaseUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_0fArYBtWE8FQ@ep-fragrant-hill-abal5wit.eu-west-2.aws.neon.tech/neondb?sslmode=require"

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // In Prisma 7, we pass the connection string directly
  // The client will automatically pick up DATABASE_URL from the environment
  // So we don't need to specify it here
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Log the database URL (without credentials) for debugging
console.log('🔌 Database URL configured:', databaseUrl.replace(/:[^:]*@/, ':****@'))
