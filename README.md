# Online Banking Platform

A modern, secure, and feature-rich online banking platform built with Next.js, Tailwind CSS, and Prisma.

## Features

- 🔐 Secure authentication with email verification and 2FA
- 💳 Multiple account types (Checking, Savings, Credit Cards, Investments)
- 💸 Real-time transactions and transfers
- 📊 Interactive dashboard with charts and analytics
- 📱 Fully responsive design
- 👨‍💼 Admin panel for user and transaction management
- 📄 PDF statement generation
- 🔔 Real-time notifications
- 📝 Audit logging for compliance
- 🚀 CI/CD ready with GitHub Actions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **Testing**: Jest + Playwright
- **Deployment**: Docker + Vercel/self-hosted

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your values
3. Run `npm install`
4. Start the database: `docker-compose up -d`
5. Run migrations: `npm run db:migrate`
6. Seed the database: `npm run db:seed`
7. Start development: `npm run dev`

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`

## Deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions.
