#!/bin/bash

echo "🔍 Debugging Admin API"
echo "======================"

# Check if files exist
echo "Checking files:"
[ -f "src/app/api/admin/transactions/route.ts" ] && echo "✅ transactions route exists" || echo "❌ transactions route missing"
[ -f "src/app/api/admin/users/route.ts" ] && echo "✅ users route exists" || echo "❌ users route missing" 
[ -f "src/app/api/admin/stats/route.ts" ] && echo "✅ stats route exists" || echo "❌ stats route missing"
[ -f "src/lib/admin/userUtils.ts" ] && echo "✅ userUtils exists" || echo "❌ userUtils missing"

# Check content of transactions route
echo ""
echo "📄 Transactions route content:"
if [ -f "src/app/api/admin/transactions/route.ts" ]; then
  cat "src/app/api/admin/transactions/route.ts"
else
  echo "File not found"
fi

# Test the API directly
echo ""
echo "🌐 Testing API directly..."
echo "=========================="

# Try to curl the API if server is running
if curl -s http://localhost:3000 > /dev/null; then
  echo "Server is running on port 3000"
  echo ""
  echo "GET /api/admin/transactions:"
  curl -s http://localhost:3000/api/admin/transactions | json_pp 2>/dev/null || echo "Failed to parse JSON"
else
  echo "❌ Server is not running on port 3000"
  echo "Please run 'npm run dev' first"
fi

echo ""
echo "🔧 Quick fix: Recreate transactions route with simpler version"
