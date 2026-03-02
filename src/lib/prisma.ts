import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

// Configure Neon for WebSocket support (required for serverless)
neonConfig.webSocketConstructor = ws

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Get database URL from environment
const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_0fArYBtWE8FQ@ep-fragrant-hill-abal5wit.eu-west-2.aws.neon.tech/neondb?sslmode=require"

// Create a connection pool
const pool = new Pool({ connectionString })

// Create a Prisma adapter for Neon using the pool
const adapter = new PrismaNeon(pool)

// Create Prisma Client with the adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
