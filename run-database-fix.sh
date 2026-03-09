#!/bin/bash

echo "🚀 Starting database fix for Oldspring Trust Bank"
echo "=================================================="
echo ""

# Step 1: Check and create tables
echo "📦 Step 1: Creating database tables..."
node check-and-create-tables.js

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Failed to create tables. Please check your database connection."
  exit 1
fi

echo ""
echo "✅ Tables created successfully!"
echo ""

# Step 2: Apply temporary fix to deposits API
echo "📦 Step 2: Applying temporary fix to deposits API..."
node temp-fix-deposits.js

echo ""
echo "🎉 All fixes applied successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your development server:"
echo "      npm run dev"
echo ""
echo "   2. Test the deposit page:"
echo "      http://localhost:3000/dashboard/deposit"
echo ""
echo "   3. If you still see errors, check:"
echo "      - Your database connection in .env"
echo "      - That the demo user exists: demo@oldspring.com"
echo ""

# Make the script executable
chmod +x run-database-fix.sh

