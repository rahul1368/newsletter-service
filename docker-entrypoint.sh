#!/bin/sh
set -e

echo "🚀 Starting Newsletter Service..."

# Run database migrations
echo "📦 Running database migrations..."
cd /app
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

