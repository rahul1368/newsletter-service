#!/bin/sh
set -e

echo "🚀 Starting Newsletter Service..."

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy || {
  echo "❌ Migration failed!"
  exit 1
}

echo "✅ Migrations completed successfully"

# Start the application
echo "✅ Starting application..."
exec node dist/apps/api/main.js

