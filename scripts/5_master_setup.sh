#!/bin/bash

# Script: 5_master_setup.sh
# Description: Run all setup scripts in order

set -e

echo "🏦 Oldspring Trust Bank - Complete Setup"
echo "========================================"

# Make all scripts executable
chmod +x scripts/*.sh

# Run scripts in order
echo "📦 Step 1: Setting up Prisma..."
./scripts/1_setup_prisma.sh

echo "🔐 Step 2: Creating Auth System..."
./scripts/2_create_auth_system.sh

echo "🛠️ Step 3: Creating Utilities..."
./scripts/3_create_utils.sh

echo "📊 Step 4: Creating Dashboard Components..."
./scripts/4_create_dashboard_components.sh

echo "📦 Step 5: Installing dependencies..."
npm install

echo "🗄️ Step 6: Running database migrations..."
npx prisma migrate dev --name init
n