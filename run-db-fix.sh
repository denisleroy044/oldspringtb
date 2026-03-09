#!/bin/bash

echo "🚀 Database Connection Fix"
echo "=========================="
echo ""

# Step 1: Run diagnostic
echo "📦 Step 1: Running diagnostic..."
node diagnose-db-connection.js

echo ""
echo "📦 Step 2: Applying connection fixes..."
./fix-db-connection.sh

echo ""
echo "📦 Step 3: Testing connection..."
node test-connection.js

echo ""
echo "🎉 Database connection fixes applied!"
echo ""
echo "📋 Next steps:"
echo "   1. If connection still fails, check Neon dashboard:"
echo "      https://console.neon.tech -> Project Settings -> IP Allow"
echo ""
echo "   2. Add your current IP to the allowlist:"
echo "      curl ifconfig.me  (to get your IP)"
echo ""
echo "   3. Restart your dev server:"
echo "      npm run dev"
echo ""

chmod +x run-db-fix.sh
