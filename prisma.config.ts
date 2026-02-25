import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  output: 'node_modules/.prisma/client',
  databases: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
