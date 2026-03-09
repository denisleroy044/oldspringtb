#!/bin/bash

echo "🔧 Quick Fix for Tax Refund Page"
echo "================================"
echo ""

echo "📦 Step 1: Create tax refund table in database"
echo ""
echo "Copy and run this SQL in your Neon console:"
echo ""
echo "========================================="
cat fix-tax-refund-table.sql
echo "========================================="
echo ""

read -p "Have you run the SQL above? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please run the SQL first, then continue"
    exit 1
fi

echo ""
echo "✅ Database table created"
echo ""

echo "📦 Step 2: Restart your development server"
echo ""
echo "Run: npm run dev"
echo ""
echo "The tax refund page should now load without errors!"
echo ""

chmod +x quick-fix.sh
