import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    // For migrations, we need the direct database URL
    url: process.env.DATABASE_URL,
  },
})
