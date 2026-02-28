import { PrismaClient } from '@prisma/client'
import { neon } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'

// Get database URL from multiple sources
const databaseUrl = process.env.DATABASE_URL || 
                    process.env.VERCEL_ENV === 'production' 
                      ? "postgresql://neondb_owner:npg_0fArYBtWE8FQ@ep-wandering-field-abm5p4a6.eu-west-2.aws.neon.tech/neondb?sslmode=require" 
                      : undefined

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined')
}

// Create a neon connection
const sql = neon(databaseUrl)

// Create an adapter
const adapter = new PrismaNeonHTTP(sql)

// Create Prisma Client with the adapter
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
