#!/bin/bash

echo "💰 Fixing Bills System"
echo "======================"
echo ""

echo "📦 Step 1: Create bills tables in database"
echo ""
echo "Copy and run this SQL in your Neon console:"
echo ""
echo "========================================="
cat create-bills-tables.sql
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

echo "📦 Step 2: Bills API files updated"
echo ""

echo "📦 Step 3: Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""

echo "🎉 Bills system fixed!"
echo ""
echo "Run: npm run dev"
echo ""
echo "Then visit: http://localhost:3000/dashboard/bills"
echo ""

chmod +x fix-bills.sh
