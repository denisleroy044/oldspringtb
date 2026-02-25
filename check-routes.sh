#!/bin/bash

echo "🔍 Checking your Next.js routes..."
echo "================================"

# Check if server is running on port 3001
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Server is running on http://localhost:3001"
    echo ""
    echo "📋 Available pages on port 3001:"
    echo "   http://localhost:3001/ - Homepage"
    echo "   http://localhost:3001/auth/login - Login"
    echo "   http://localhost:3001/auth/signup - Signup"
    echo "   http://localhost:3001/dashboard - Dashboard"
    echo "   http://localhost:3001/dashboard/profile - Profile"
    echo "   http://localhost:3001/marketing/about - About"
    echo "   http://localhost:3001/marketing/services - Services"
    echo "   http://localhost:3001/marketing/wealth-management - Wealth Management"
    echo "   http://localhost:3001/marketing/contact - Contact"
    echo ""
    echo "👉 Open: http://localhost:3001"
else
    echo "❌ Server is NOT running on port 3001"
    echo "   Run: npm run dev"
fi

# Check if port 3000 is also running something
if curl -s http://localhost:3000 > /dev/null; then
    echo ""
    echo "⚠️  Something is running on port 3000 (but not your Next.js app)"
fi
