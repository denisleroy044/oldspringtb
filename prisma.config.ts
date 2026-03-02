import { defineConfig } from '@prisma/config'

// Use environment variable with a fallback for build
const databaseUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_0fArYBtWE8FQ@ep-fragrant-hill-abal5wit.eu-west-2.aws.neon.tech/neondb?sslmode=require"

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
})
