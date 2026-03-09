#!/bin/bash

echo "🔧 Running Simple Database Fix"
echo "=============================="
echo ""

echo "📋 Copy and run this SQL in your Neon console:"
echo ""
echo "========================================="
cat simple-database-fix.sql
echo "========================================="
echo ""

read -p "Have you run the SQL above? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please run the SQL first, then continue"
    exit 1
fi

echo ""
echo "✅ Database fixes applied"
echo ""

echo "📦 Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""

echo "🎉 All done! Now run: npm run dev"
echo ""

chmod +x simple-fix.sh
