#!/bin/bash

echo "🧪 Starting Local Testing..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://newsletter_user:newsletter_password@localhost:5432/newsletter_db"
DATABASE_USER="newsletter_user"
DATABASE_PASSWORD="newsletter_password"
DATABASE_NAME="newsletter_db"
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""
RESEND_API_KEY="re_test_key"
SENDER_EMAIL="onboarding@resend.dev"
PORT=3000
NODE_ENV=development
ENVEOF
    echo -e "${GREEN}✅ .env file created. Please update RESEND_API_KEY with your actual key.${NC}"
fi

echo "1️⃣  Starting Docker services..."
docker-compose up -d

echo "Waiting for services to be ready..."
sleep 5

echo ""
echo "2️⃣  Running database migrations..."
pnpm prisma:generate
pnpm prisma:migrate dev --name init

echo ""
echo "3️⃣  Building Docker image..."
docker build -t newsletter-service:test .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

echo ""
echo "4️⃣  Starting application container..."
docker stop newsletter-test 2>/dev/null
docker rm newsletter-test 2>/dev/null

docker run -d \
  --name newsletter-test \
  --network newsletter-service_default \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://newsletter_user:newsletter_password@postgres:5432/newsletter_db" \
  -e REDIS_HOST="redis" \
  -e REDIS_PORT="6379" \
  -e REDIS_PASSWORD="" \
  -e RESEND_API_KEY="${RESEND_API_KEY:-re_test_key}" \
  -e SENDER_EMAIL="onboarding@resend.dev" \
  -e PORT=3000 \
  -e NODE_ENV=production \
  newsletter-service:test

echo "Waiting for application to start..."
sleep 10

echo ""
echo "5️⃣  Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "$HEALTH_RESPONSE"
    docker logs newsletter-test
    exit 1
fi

echo ""
echo "6️⃣  Testing stats endpoint..."
STATS_RESPONSE=$(curl -s http://localhost:3000/stats)
echo "$STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATS_RESPONSE"

echo ""
echo -e "${GREEN}✅ Local testing complete!${NC}"
echo ""
echo "To test manually:"
echo "  Health: curl http://localhost:3000/health"
echo "  Stats:  curl http://localhost:3000/stats"
echo ""
echo "To clean up:"
echo "  docker stop newsletter-test && docker rm newsletter-test"
echo "  docker-compose down"
