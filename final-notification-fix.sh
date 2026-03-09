#!/bin/bash

echo "🔧 Running Final Notification System Fix"
echo "========================================"
echo ""

# Step 1: Fix database schema
echo "📦 Step 1: Fixing database schema..."
node fix-notifications-schema.js

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Failed to fix schema. Please check your database connection."
  exit 1
fi

echo ""
echo "✅ Database schema fixed successfully!"
echo ""

# Step 2: Restart instructions
echo "📦 Step 2: Ready to test!"
echo ""
echo "🎉 All fixes applied successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your development server:"
echo "      npm run dev"
echo ""
echo "   2. Visit the notifications page:"
echo "      http://localhost:3000/dashboard/notifications"
echo ""
echo "   3. Test deposit notifications:"
echo "      - Go to http://localhost:3000/dashboard/deposit"
echo "      - Submit a deposit request"
echo "      - Check header bell for new notification"
echo ""

chmod +x final-notification-fix.sh
