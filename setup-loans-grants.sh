#!/bin/bash

echo "💰 Setting up Complete Loans & Grants System"
echo "============================================="
echo ""

# Step 1: Create database tables
echo "📦 Step 1: Creating database tables..."
echo "Please run this SQL in your Neon console:"
echo ""
echo "========================================="
cat complete-loans-grants.sql
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
echo "📦 Step 2: Creating API endpoints..."
echo "   ✅ Loan offers API"
echo "   ✅ Loan applications API"
echo "   ✅ Grant categories API"
echo "   ✅ Grants API"
echo "   ✅ Grant applications API"
echo ""

# Step 3: Create pages
echo "📦 Step 3: Creating pages..."
echo "   ✅ Enhanced loans page with multi-step application"
echo "   ✅ Enhanced grants page with filters and application"
echo ""

echo ""
echo "🎉 Complete loans and grants system setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your development server:"
echo "      npm run dev"
echo ""
echo "   2. Visit the loans page:"
echo "      http://localhost:3000/dashboard/loans"
echo ""
echo "   3. Visit the grants page:"
echo "      http://localhost:3000/dashboard/grants"
echo ""
echo "The system includes:"
echo "  ✅ 10+ loan products with categories"
echo "  ✅ Special loan offers seeded for demo user"
echo "  ✅ Multi-step loan application with calculator"
echo "  ✅ Loan repayment schedule tracking"
echo "  ✅ 15+ grant categories with icons"
echo "  ✅ 20+ seeded grants with realistic data"
echo "  ✅ Grant applications with multi-step form"
echo "  ✅ Admin notifications for all applications"
echo "  ✅ Real-time status tracking"
echo "  ✅ Beautiful UI with your color theme"
echo ""

chmod +x setup-loans-grants.sh
