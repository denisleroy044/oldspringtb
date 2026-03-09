#!/bin/bash

echo "🔧 Running Final Database Schema Fix"
echo "===================================="
echo ""

echo "📦 Step 1: Run the SQL in your Neon console"
echo ""
echo "Copy and run this SQL in your Neon console:"
echo ""
echo "========================================="
cat fix-all-schemas.sql
echo "========================================="
echo ""

read -p "Have you run the SQL above? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please run the SQL first, then continue"
    exit 1
fi

echo ""
echo "✅ Database schema fixed"
echo ""

echo "📦 Step 2: Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""

echo "📦 Step 3: Restarting development server..."
echo ""
echo "Run this command:"
echo "  npm run dev"
echo ""
echo "The server will restart with all fixes applied."
echo ""

chmod +x final-fix.sh
