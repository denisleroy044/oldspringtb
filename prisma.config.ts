import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  databases: {
    db: {
      directUrl: process.env.DATABASE_URL,
    },
  },
})
