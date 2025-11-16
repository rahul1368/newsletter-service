# Newsletter Service

A newsletter service built with NestJS that sends pre-decided content to subscribers at specified intervals/time.

## Tech Stack

- **Framework:** NestJS + TypeScript (Monorepo)
- **Database:** PostgreSQL + Prisma ORM
- **Job Queue:** BullMQ + Redis
- **Email Service:** Resend
- **Validation:** Zod
- **Containerization:** Docker + Docker Compose

## Features

- Subscriber management (email addresses)
- Topic-based content organization
- Content scheduling with automatic email delivery
- Email logging and tracking
- RESTful API for managing subscribers, topics, and content

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Docker and Docker Compose

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd newsletter-service
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start Docker services (PostgreSQL + Redis)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port `5432`
- Redis on port `6379`

### 4. Configure environment variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `RESEND_API_KEY` - Your Resend API key (get from https://resend.com)

### 5. Run database migrations

```bash
pnpm prisma migrate dev --name init
```

### 6. Generate Prisma Client

```bash
pnpm prisma generate
```

### 7. Start the development server

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

- `pnpm start` - Start the API application
- `pnpm start:dev` - Start in development mode with watch
- `pnpm start:debug` - Start in debug mode
- `pnpm start:prod` - Start production build
- `pnpm build` - Build the API application
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run E2E tests
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
newsletter-service/
├── apps/
│   └── api/              # Main API application
│       ├── src/
│       │   ├── prisma/  # Prisma service module
│       │   └── ...
│       └── test/        # E2E tests
├── libs/                 # Shared libraries (future)
├── prisma/
│   └── schema.prisma    # Database schema
├── docker-compose.yml    # Docker services configuration
└── package.json
```

## API Endpoints

### Subscribers
- `POST /api/subscribers` - Add new subscriber
- `GET /api/subscribers` - List all subscribers
- `GET /api/subscribers/:id` - Get subscriber details
- `DELETE /api/subscribers/:id` - Remove subscriber
- `POST /api/subscribers/:id/subscribe/:topicId` - Subscribe to topic
- `DELETE /api/subscribers/:id/subscribe/:topicId` - Unsubscribe from topic

### Topics
- `POST /api/topics` - Create new topic
- `GET /api/topics` - List all topics
- `GET /api/topics/:id` - Get topic details
- `GET /api/topics/:id/subscribers` - Get all subscribers of a topic
- `DELETE /api/topics/:id` - Delete topic

### Content
- `POST /api/content` - Create new content
- `GET /api/content` - List all content (with filters)
- `GET /api/content/:id` - Get content details
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `GET /api/content/topic/:topicId` - Get content for a topic

### Health/Status
- `GET /health` - Health check
- `GET /api/stats` - Service statistics

## Database Schema

- **Topics** - Newsletter topics/categories
- **Subscribers** - Email subscribers
- **Subscriptions** - Many-to-many relationship between subscribers and topics
- **Content** - Newsletter content with scheduling information
- **EmailLogs** - Email delivery tracking

## How It Works

1. **Create Topics** - Define newsletter topics (e.g., "Tech News", "Product Updates")
2. **Add Subscribers** - Add email addresses to the system
3. **Subscribe Users** - Associate subscribers with topics
4. **Create Content** - Create content with a scheduled send time and associate it with a topic
5. **Automatic Sending** - The system automatically sends content to all subscribers of that topic at the scheduled time

## Development

### Adding a new module

```bash
pnpm nest generate module <module-name> --project api
pnpm nest generate service <module-name> --project api
pnpm nest generate controller <module-name> --project api
```

### Database changes

After modifying `prisma/schema.prisma`:

```bash
pnpm prisma migrate dev --name <migration-name>
pnpm prisma generate
```

## Deployment

See `PLANNING.md` for deployment considerations and improvements.

## License

MIT
