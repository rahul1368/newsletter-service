# Multi-stage build for production
# Using Debian-based image for better Prisma compatibility
FROM node:20-slim AS builder

# Install pnpm and OpenSSL (required for Prisma)
RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nest-cli.json tsconfig.json ./

# Copy prisma schema
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client (with retry for network issues)
RUN PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma:generate && \
    ls -la node_modules/.prisma/client 2>/dev/null && \
    echo "Prisma Client generated successfully" || \
    (echo "Retrying Prisma generation..." && sleep 10 && PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma:generate && \
     ls -la node_modules/.prisma/client && echo "Prisma Client generated on retry") || \
    (echo "ERROR: Prisma Client generation failed!" && exit 1)

# Copy source code
COPY apps ./apps
COPY libs ./libs

# Build the application
RUN pnpm build

# Production stage
FROM node:20-slim AS production

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy Prisma files
COPY prisma ./prisma

# Install production dependencies + Prisma CLI (needed for migrations)
RUN pnpm install --frozen-lockfile --prod && \
    npm install -g prisma

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Install Prisma CLI and generate Prisma Client for production
# Use environment variable to handle network issues
RUN npm install -g prisma && \
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 PRISMA_ENGINES_MIRROR=https://binaries.prisma.sh prisma generate || \
    (sleep 5 && PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 prisma generate)

# Copy entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Make entrypoint executable
RUN chmod +x ./docker-entrypoint.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script to run migrations before starting
ENTRYPOINT ["./docker-entrypoint.sh"]

