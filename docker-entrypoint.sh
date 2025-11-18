#!/bin/sh
set -e

echo "🚀 Starting Newsletter Service..."

# Run database migrations
echo "📦 Running database migrations..."
cd /app

# Debug: Check if migrations directory exists
echo "Checking migrations directory..."
ls -la prisma/ || echo "prisma directory not found!"
ls -la prisma/migrations/ || echo "migrations directory not found!"

# Run migrations
pnpm exec prisma migrate deploy || {
  echo "❌ Migration failed!"
  echo "Attempting with npx..."
  npx prisma migrate deploy || {
    echo "❌ Migration failed with both pnpm and npx!"
    exit 1
  }
}

echo "✅ Migrations completed successfully"

# Start the application
echo "✅ Starting application..."
exec node dist/apps/api/main.js

