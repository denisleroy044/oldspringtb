import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  databases: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
