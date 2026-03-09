#!/bin/bash

echo "📊 Fixing Statements System"
echo "==========================="
echo ""

echo "📦 Step 1: Create statements tables in database"
echo ""
echo "Copy and run this SQL in your Neon console:"
echo ""
echo "========================================="
cat create-statements-tables.sql
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

echo "📦 Step 2: Statements API files updated"
echo ""

echo "📦 Step 3: Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""

echo "🎉 Statements system fixed!"
echo ""
echo "Run: npm run dev"
echo ""
echo "Then visit: http://localhost:3000/dashboard/statements"
echo ""

chmod +x fix-statements.sh
