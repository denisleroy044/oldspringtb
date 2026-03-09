#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting deployment..."

# Build the application
echo "Building application..."
npm run build

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting application..."
npm run start

echo "✅ Deployment completed successfully!"
