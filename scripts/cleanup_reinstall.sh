#!/bin/bash

# Script: cleanup_reinstall.sh
# Description: Complete cleanup and reinstall with Prisma 6

set -e

echo "🧹 Starting complete cleanup and reinstall..."

# 1. Stop any running Next.js processes
echo "Stopping any running Next.js processes..."
taskkill /F /IM node.exe 2>/dev/null || true

# 2. Remove Prisma completely
echo "Removing Prisma completely..."
npm uninstall -g prisma 2>/dev/null || true
npm uninstall @prisma/client prisma
rm -rf node_modules/.prisma
rm -rf prisma/migrations
rm -f prisma.config.ts
rm -f prisma/schema.prisma

# 3. Install Prisma 6
echo "Installing Prisma 6.6.0..."
npm install prisma@6.6.0 --save-dev
npm install @prisma/client@6.6.0

# 4. Initialize Prisma
echo "Initializing Prisma..."
npx prisma init

# 5. Create fresh schema
echo "Creating fresh schema..."
cat > prisma/schema.prisma << 'EOF'
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?
  firstName     String?
  lastName      String?
  name          String?
  phone         String?
  role          String    @default("USER")
  accountType   String?   @default("personal")
  isVerified    Boolean   @default(false)
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret String?
  resetToken    String?
  resetTokenExpiry DateTime?
  avatar        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  cards         Card[]
  transactions  Transaction[]
  beneficiaries Beneficiary[]
  otps          OTP[]
}

// Bank accounts
model Account {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accountNumber String    @unique
  type          String    @default("CHECKING")
  balance       Float     @default(0)
  currency      String    @default("USD")
  status        String    @default("ACTIVE")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  transactions  Transaction[]
  cards         Card[]
}

// Transactions
model Transaction {
  id            String    @id @default(cuid())
  accountId     String
  account       Account   @relation(fields: [accountId], references: [id], onDelete: Cascade)
  type          String    // CREDIT, DEBIT, TRANSFER
  amount        Float
  description   String?
  status        String    @default("COMPLETED")
  reference     String?
  createdAt     DateTime  @default(now())
}

// Cards
model Card {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accountId     String
  account       Account   @relation(fields: [accountId], references: [id], onDelete: Cascade)
  cardNumber    String    @unique
  cardType      String    // VISA, MASTERCARD
  expiryMonth   Int
  expiryYear    Int
  cvv           String
  status        String    @default("ACTIVE")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// Beneficiaries
model Beneficiary {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  accountNumber String
  bankName      String?
  email         String?
  phone         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([userId, accountNumber])
}

// OTP for authentication
model OTP {
  id        String   @id @default(cuid())
  email     String
  code      String
  purpose   String   // ACCOUNT_OPENING, 2FA, PASSWORD_RESET
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([email, purpose])
  @@index([expiresAt])
}
EOF

# 6. Update .env with DATABASE_URL if needed
echo "Checking DATABASE_URL in .env..."
if ! grep -q "DATABASE_URL" .env; then
  echo 'DATABASE_URL="postgresql://neondb_owner:npg_0fArYBtWE8FQ@ep-fragrant-hill-abal5wit.eu-west-2.aws.neon.tech/neondb?sslmode=require"' >> .env
  echo "✅ DATABASE_URL added to .env"
else
  echo "✅ DATABASE_URL already exists in .env"
fi

# 7. Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# 8. Create initial migration
echo "Creating initial migration..."
npx prisma migrate dev --name init

echo "✅ Prisma 6 setup complete!"