#!/bin/bash

echo "📅 Setting Up Planning Pages (Calendar, Goals, Savings)"
echo "========================================================"
echo ""

echo "📦 Step 1: Create database tables"
echo ""
echo "Copy and run this SQL in your Neon console:"
echo ""
echo "========================================="
cat create-planning-tables.sql
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

echo "📦 Step 2: API endpoints created"
echo "   ✅ Calendar API"
echo "   ✅ Goals API"
echo "   ✅ Savings API"
echo "   ✅ Savings Templates API"
echo "   ✅ Contributions API"
echo ""

echo "📦 Step 3: Pages created"
echo "   ✅ Calendar page"
echo "   ✅ Goals page"
echo "   ✅ Savings page"
echo ""

echo "📦 Step 4: Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""

echo "🎉 Planning pages setup complete!"
echo ""
echo "Run: npm run dev"
echo ""
echo "Then visit:"
echo "   http://localhost:3000/dashboard/calendar"
echo "   http://localhost:3000/dashboard/goals"
echo "   http://localhost:3000/dashboard/savings"
echo ""

chmod +x setup-planning.sh
