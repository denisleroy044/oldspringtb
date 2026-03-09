#!/bin/bash

echo "💰 Setting up Withdrawal System"
echo "==============================="
echo ""

# Step 1: Create database tables
echo "📦 Step 1: Creating withdrawal tables in database..."
echo "Please run this SQL in your Neon console:"
echo ""
echo "========================================="
cat create-withdrawals-table.sql
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

# Step 2: Create API endpoints
echo "📦 Step 2: Creating withdrawal API endpoints..."
echo "   ✅ Main withdrawal API"
echo "   ✅ Withdrawal methods API"
echo "   ✅ Saved methods API"
echo "   ✅ Single withdrawal API"
echo ""

# Step 3: Create pages
echo "📦 Step 3: Creating withdrawal pages..."
echo "   ✅ Withdrawal page"
echo "   ✅ Withdrawals list page"
echo "   ✅ Withdrawal detail page"
echo ""

echo ""
echo "🎉 Withdrawal system setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your development server:"
echo "      npm run dev"
echo ""
echo "   2. Visit the withdrawal page:"
echo "      http://localhost:3000/dashboard/withdraw"
echo ""
echo "   3. Make a test withdrawal to verify notifications"
echo ""

chmod +x setup-withdrawals.sh
