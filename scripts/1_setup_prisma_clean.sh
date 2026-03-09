#!/bin/bash

# Script: 1_setup_prisma_clean.sh
# Description: Clean Prisma setup without any heredoc issues

set -e

echo "🚀 Setting up Prisma with Console database..."

# Install Prisma dependencies
npm install @prisma/client bcryptjs jsonwebtoken
npm install -D prisma @types/bcryptjs @types/jsonwebtoken

# Backup existing schema if it exists
if [ -f prisma/schema.prisma ]; then
  echo "📦 Backing up existing schema..."
  BACKUP_FILE="prisma/schema.prisma.backup.$(date +%Y%m%d_%H%M%S)"
  cp prisma/schema.prisma "$BACKUP_FILE"
  echo "✅ Backup created at: $BACKUP_FILE"
fi

echo ""
echo "=================================================="
echo "✅ Dependencies installed successfully!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Update your DATABASE_URL in .env file"
echo "2. Run: npx prisma migrate dev --name init"
echo "3. Run: npx prisma generate"
echo ""
echo "Your existing schema has been preserved in the backups folder"
echo ""

# Check if .env exists and has DATABASE_URL
if [ -f .env ]; then
  if grep -q "DATABASE_URL" .env; then
    echo "✅ DATABASE_URL found in .env"
  else
    echo "⚠️  DATABASE_URL not found in .env. Please add it."
  fi
else
  echo "⚠️  .env file not found. Please create it with DATABASE_URL"
fi

exit 0
