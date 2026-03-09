#!/bin/bash

echo "💰 Fixing Grants System"
echo "======================="
echo ""

echo "📦 Step 1: Create grants tables in database"
echo ""
echo "Copy and run this SQL in your Neon console:"
echo ""
echo "========================================="
cat create-grants-tables.sql
echo "========================================="
echo ""

read -p "Have you run the SQL above? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please run the SQL first, then continue"
    exit 1
fi

echo ""
echo "✅ Database tables created"
echo ""

echo "📦 Step 2: Grants API files updated"
echo ""

echo "📦 Step 3: Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""

echo "🎉 Grants system fixed!"
echo ""
echo "Run: npm run dev"
echo ""
echo "Then visit: http://localhost:3000/dashboard/grants"
echo ""

chmod +x fix-grants.sh
