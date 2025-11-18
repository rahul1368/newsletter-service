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
# Note: With pnpm, Prisma Client is generated to node_modules/.pnpm/@prisma+client@.../node_modules/@prisma/client
# We rely on Prisma's exit code rather than checking a specific path
RUN PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma:generate || \
    (echo "Retrying Prisma generation..." && sleep 10 && PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma:generate) || \
    (echo "ERROR: Prisma Client generation failed!" && exit 1)

# Copy source code
COPY apps ./apps
# Create libs directory (empty for now, but needed for monorepo structure)
RUN mkdir -p ./libs

# Build the application
RUN pnpm build

# Production stage
FROM node:20-slim AS production

# Install OpenSSL (required for Prisma) and pnpm
RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy Prisma files
COPY prisma ./prisma

# Install production dependencies (includes @prisma/client)
# Also install prisma CLI as dev dependency for migrations and client generation
RUN pnpm install --frozen-lockfile --prod && \
    pnpm add -D -w prisma

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Generate Prisma Client for production (needed at runtime)
# Use environment variable to handle network issues
RUN PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma:generate || \
    (echo "Retrying Prisma generation..." && sleep 5 && PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma:generate) || \
    (echo "ERROR: Prisma Client generation failed!" && exit 1)

# Copy entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Make entrypoint executable
RUN chmod +x ./docker-entrypoint.sh

# Create non-root user (Debian syntax)
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/sh nestjs

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
CMD []

