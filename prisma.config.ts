import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // For migrations, we can use the same Accelerate URL since Prisma 7 supports it
    url: process.env.DATABASE_URL,
  },
})
