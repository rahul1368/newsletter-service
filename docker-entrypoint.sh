#!/bin/sh
set -e

echo "🚀 Starting Newsletter Service..."

# Run database migrations
echo "📦 Running database migrations..."
prisma migrate deploy || {
  echo "⚠️  Migration failed, but continuing..."
}

# Start the application
echo "✅ Starting application..."
exec node dist/apps/api/main.js

