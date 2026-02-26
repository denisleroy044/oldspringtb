import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Only create PrismaClient if DATABASE_URL exists AND we're not in build
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

// During build, always return null to avoid database connection attempts
export const prisma = !isBuild && process.env.DATABASE_URL
  ? (global.prisma || new PrismaClient())
  : null

if (process.env.NODE_ENV !== 'production' && prisma) global.prisma = prisma
