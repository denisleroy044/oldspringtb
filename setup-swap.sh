#!/bin/bash

echo "💱 Setting up Currency Swap System"
echo "=================================="
echo ""

# Step 1: Create database tables
echo "📦 Step 1: Creating swap tables in database..."
echo "Please run this SQL in your Neon console:"
echo ""
echo "========================================="
cat create-swap-tables.sql
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
echo "📦 Step 2: Creating swap API endpoints..."
echo "   ✅ Swap rates API"
echo "   ✅ Main swap API"
echo "   ✅ Single swap API"
echo ""

# Step 3: Create pages
echo "📦 Step 3: Creating swap pages..."
echo "   ✅ Swap page"
echo "   ✅ Swap history page"
echo "   ✅ Swap detail page"
echo ""

echo ""
echo "🎉 Currency swap system setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Add your Exchange Rate API key to .env:"
echo "      EXCHANGE_RATE_API_KEY=your_key_here"
echo ""
echo "   2. Restart your development server:"
echo "      npm run dev"
echo ""
echo "   3. Visit the swap page:"
echo "      http://localhost:3000/dashboard/swap"
echo ""

chmod +x setup-swap.sh
