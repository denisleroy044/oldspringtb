#!/bin/bash

# Script: setup_all.sh
# Description: Run all setup scripts with error checking

set -e

echo "🏦 Oldspring Trust Bank - Complete Setup"
echo "========================================"
echo ""

# Function to run script with error checking
run_script() {
  echo ""
  echo "📦 Running: $1"
  echo "========================"
  
  if [ -f "scripts/$1" ]; then
    chmod +x "scripts/$1"
    ./scripts/$1
    
    if [ $? -eq 0 ]; then
      echo "✅ $1 completed successfully!"
    else
      echo "❌ $1 failed!"
      exit 1
    fi
  else
    echo "❌ Script scripts/$1 not found!"
    exit 1
  fi
}

# Run scripts in order
run_script "1_setup_prisma.sh"

echo ""
echo "Running database migrations..."
npx prisma migrate dev --name init
npx prisma generate

run_script "2_create_auth_system.sh"
run_script "3_create_utils.sh"
run_script "4_create_dashboard_components.sh"

echo ""
echo "🎉 All setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL in .env if needed"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "📁 Your project is ready!"
EOF