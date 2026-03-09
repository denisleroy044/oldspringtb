#!/bin/bash

echo "🚀 Running Final Notification System Setup"
echo "=========================================="
echo ""

# Step 1: Setup database
echo "📦 Step 1: Setting up database..."
node setup-notifications-final.js

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Database setup failed"
  exit 1
fi

echo ""
echo "✅ Database setup complete!"
echo ""

# Step 2: Test the setup
echo "📦 Step 2: Testing setup..."
node test-notifications-api.js

echo ""
echo "🎉 All done! Now restart your development server:"
echo "   npm run dev"
echo ""
echo "Then visit:"
echo "   http://localhost:3000/dashboard/notifications"
echo ""

chmod +x final-run.sh
