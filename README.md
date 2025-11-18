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

Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/newsletter_db"
DATABASE_USER="user"
DATABASE_PASSWORD="password"
DATABASE_NAME="newsletter_db"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# Email Service (Resend)
RESEND_API_KEY="re_YOUR_RESEND_API_KEY"
SENDER_EMAIL="onboarding@resend.dev"

# Application
PORT=3000
NODE_ENV=development
```

**Required variables:**
- `DATABASE_URL` - PostgreSQL connection string (must match docker-compose.yml)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `RESEND_API_KEY` - Your Resend API key (get from https://resend.com)
- `SENDER_EMAIL` - Email address for sending newsletters (default: onboarding@resend.dev)

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

**Swagger API Documentation:** `http://localhost:3000/api`

## Available Scripts

### Development
- `pnpm start` - Start the API application
- `pnpm start:dev` - Start in development mode with watch (hot reload)
- `pnpm start:debug` - Start in debug mode
- `pnpm start:prod` - Start production build

### Building
- `pnpm build` - Build the API application for production

### Testing
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run E2E tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:cov` - Run tests with coverage

### Code Quality
- `pnpm lint` - Lint code and auto-fix issues
- `pnpm format` - Format code with Prettier

### Database
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run database migrations (development)
- `pnpm prisma:studio` - Open Prisma Studio (database GUI)
- `pnpm prisma:seed` - Seed the database (if seed file exists)

## Project Structure

```
newsletter-service/
├── apps/
│   └── api/                    # Main API application
│       ├── src/
│       │   ├── common/         # Shared utilities (filters, pipes)
│       │   ├── content/        # Content management module
│       │   ├── email/           # Email service and processor
│       │   ├── health/          # Health check module
│       │   ├── prisma/          # Prisma service module
│       │   ├── stats/           # Statistics module
│       │   ├── subscribers/     # Subscriber management module
│       │   ├── subscriptions/   # Subscription management module
│       │   ├── topics/         # Topic management module
│       │   ├── app.module.ts   # Root module
│       │   └── main.ts         # Application entry point
│       └── test/                # E2E tests
├── libs/                        # Shared libraries (empty for now)
├── prisma/
│   ├── migrations/             # Database migrations
│   └── schema.prisma           # Database schema
├── docker-compose.yml           # Docker services configuration
├── Dockerfile                   # Production Docker image
├── docker-entrypoint.sh         # Entrypoint script for migrations
├── render.yaml                  # Render deployment configuration
└── package.json                # Root package.json
```

## API Documentation

### Swagger UI

Interactive API documentation is available via Swagger UI:

- **Local Development:** `http://localhost:3000/api`
- **Production:** `https://newsletter-api-wujw.onrender.com/api`

The Swagger UI provides:
- Complete API endpoint documentation
- Interactive API testing
- Request/response schemas
- Example payloads
- Try-it-out functionality

### API Endpoints

**Base URLs:**
- **Local Development:** `http://localhost:3000`
- **Production:** `https://newsletter-api-wujw.onrender.com`

All endpoints return JSON. Error responses follow a consistent format:
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/subscribers",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Subscribers

#### Create Subscriber
**POST** `/subscribers`

Creates a new subscriber with an email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### List All Subscribers
**GET** `/subscribers`

Returns a list of all subscribers.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

#### Get Subscriber by ID
**GET** `/subscribers/:id`

Returns details of a specific subscriber.

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### Update Subscriber
**PATCH** `/subscribers/:id`

Updates subscriber information.

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "isActive": false
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "isActive": false,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### Delete Subscriber
**DELETE** `/subscribers/:id`

Removes a subscriber from the system.

**Response:** `200 OK`
```json
{
  "message": "Subscriber with ID 1 has been deleted"
}
```

### Topics

#### Create Topic
**POST** `/topics`

Creates a new newsletter topic.

**Request Body:**
```json
{
  "name": "Tech News",
  "description": "Latest technology updates and news"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Tech News",
  "description": "Latest technology updates and news",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

#### List All Topics
**GET** `/topics`

Returns a list of all topics.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Tech News",
    "description": "Latest technology updates and news",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

#### Get Topic by ID
**GET** `/topics/:id`

Returns details of a specific topic.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Tech News",
  "description": "Latest technology updates and news",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

#### Get Topic Subscribers
**GET** `/topics/:id/subscribers`

Returns all subscribers subscribed to a topic.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "isActive": true,
    "subscribedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

#### Update Topic
**PATCH** `/topics/:id`

Updates topic information.

**Request Body:**
```json
{
  "name": "Updated Tech News",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Updated Tech News",
  "description": "Updated description",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

#### Delete Topic
**DELETE** `/topics/:id`

Deletes a topic and all associated subscriptions.

**Response:** `200 OK`
```json
{
  "message": "Topic with ID 1 has been deleted"
}
```

### Subscriptions

#### Subscribe to Topic
**POST** `/subscribers/:id/subscribe/:topicId`

Subscribes a user to a topic.

**Response:** `201 Created`
```json
{
  "id": 1,
  "subscriberId": 1,
  "topicId": 1,
  "subscribedAt": "2024-01-01T12:00:00.000Z"
}
```

#### Unsubscribe from Topic
**DELETE** `/subscribers/:id/subscribe/:topicId`

Unsubscribes a user from a topic.

**Response:** `200 OK`
```json
{
  "message": "Subscriber 1 unsubscribed from topic 1"
}
```

### Content

#### Create Content
**POST** `/content`

Creates new newsletter content with a scheduled send time.

**Request Body:**
```json
{
  "topicId": 1,
  "title": "Weekly Tech Roundup",
  "body": "This week in tech...",
  "scheduledAt": "2024-01-15T10:00:00.000Z"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "topicId": 1,
  "title": "Weekly Tech Roundup",
  "body": "This week in tech...",
  "scheduledAt": "2024-01-15T10:00:00.000Z",
  "status": "pending",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "topic": {
    "id": 1,
    "name": "Tech News"
  }
}
```

#### List All Content
**GET** `/content`

Returns a list of all content, ordered by scheduled time (newest first).

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "topicId": 1,
    "title": "Weekly Tech Roundup",
    "body": "This week in tech...",
    "scheduledAt": "2024-01-15T10:00:00.000Z",
    "sentAt": null,
    "status": "pending",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "topic": {
      "id": 1,
      "name": "Tech News"
    },
    "_count": {
      "emailLogs": 0
    }
  }
]
```

#### Get Content by ID
**GET** `/content/:id`

Returns detailed information about specific content, including email logs.

**Response:** `200 OK`
```json
{
  "id": 1,
  "topicId": 1,
  "title": "Weekly Tech Roundup",
  "body": "This week in tech...",
  "scheduledAt": "2024-01-15T10:00:00.000Z",
  "sentAt": "2024-01-15T10:00:05.000Z",
  "status": "sent",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:05.000Z",
  "topic": {
    "id": 1,
    "name": "Tech News",
    "_count": {
      "subscriptions": 10
    }
  },
  "emailLogs": [
    {
      "id": 1,
      "subscriberId": 1,
      "sentAt": "2024-01-15T10:00:05.000Z",
      "status": "sent",
      "subscriber": {
        "email": "user@example.com"
      }
    }
  ],
  "_count": {
    "emailLogs": 10
  }
}
```

#### Get Content by Topic
**GET** `/content/topic/:topicId`

Returns all content for a specific topic.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "topicId": 1,
    "title": "Weekly Tech Roundup",
    "body": "This week in tech...",
    "scheduledAt": "2024-01-15T10:00:00.000Z",
    "status": "pending",
    "topic": {
      "id": 1,
      "name": "Tech News"
    }
  }
]
```

#### Update Content
**PATCH** `/content/:id`

Updates content information. Cannot update content that has already been sent.

**Request Body:**
```json
{
  "title": "Updated Title",
  "body": "Updated body content",
  "scheduledAt": "2024-01-20T10:00:00.000Z"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "topicId": 1,
  "title": "Updated Title",
  "body": "Updated body content",
  "scheduledAt": "2024-01-20T10:00:00.000Z",
  "status": "pending",
  "topic": {
    "id": 1,
    "name": "Tech News"
  }
}
```

#### Delete Content
**DELETE** `/content/:id`

Deletes content. Cannot delete content that has already been sent.

**Response:** `200 OK`
```json
{
  "message": "Content with ID 1 has been deleted"
}
```

### Health & Statistics

#### Health Check
**GET** `/health`

Checks the health status of the service and its dependencies (database and Redis).

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "checks": {
    "database": {
      "status": "healthy"
    },
    "redis": {
      "status": "healthy"
    }
  }
}
```

**Test:** `curl https://newsletter-api-wujw.onrender.com/health`

#### Service Statistics
**GET** `/stats`

Returns comprehensive statistics about the service including subscriber counts, topic counts, content status, and email delivery statistics.

**Response:** `200 OK`
```json
{
  "subscribers": {
    "total": 100,
    "active": 95,
    "inactive": 5
  },
  "topics": {
    "total": 10
  },
  "subscriptions": {
    "total": 250
  },
  "content": {
    "total": 50,
    "pending": 5,
    "sent": 43,
    "failed": 2
  },
  "emails": {
    "total": 1000,
    "sent": 980,
    "failed": 20
  }
}
```

## Database Schema

- **Topics** - Newsletter topics/categories
- **Subscribers** - Email subscribers
- **Subscriptions** - Many-to-many relationship between subscribers and topics
- **Content** - Newsletter content with scheduling information
- **EmailLogs** - Email delivery tracking

## How It Works

1. **Create Topics** - Define newsletter topics (e.g., "Tech News", "Product Updates")
2. **Add Subscribers** - Add email addresses to the system
3. **Subscribe Users** - Associate subscribers with topics they want to receive
4. **Create Content** - Create content with a scheduled send time and associate it with a topic
5. **Automatic Scheduling** - When content is created, a job is automatically scheduled in BullMQ (Redis) for the specified time
6. **Automatic Sending** - At the scheduled time, the EmailProcessor automatically:
   - Fetches all active subscribers for the content's topic
   - Sends personalized emails via Resend API
   - Logs each email delivery attempt in EmailLog
   - Updates content status to "sent" or "failed"

**Key Features:**
- ✅ Automatic email scheduling with BullMQ
- ✅ Email delivery tracking and logging
- ✅ Retry mechanism for failed emails
- ✅ Topic-based subscription management
- ✅ Content protection (cannot modify/delete sent content)

## Usage Guide

### Step-by-Step Example

This guide walks you through setting up and using the newsletter service.

#### 1. Create a Topic

First, create a topic for your newsletter:

```bash
curl -X POST http://localhost:3000/topics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly Tech Updates",
    "description": "Latest technology news and updates"
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "Weekly Tech Updates",
  "description": "Latest technology news and updates",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

#### 2. Add Subscribers

Add email addresses to your subscriber list:

```bash
curl -X POST http://localhost:3000/subscribers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com"
  }'
```

Add multiple subscribers:

```bash
curl -X POST http://localhost:3000/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email": "user2@example.com"}'

curl -X POST http://localhost:3000/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email": "user3@example.com"}'
```

#### 3. Subscribe Users to Topics

Subscribe users to the topic you created:

```bash
# Subscribe user1 (ID: 1) to topic (ID: 1)
curl -X POST http://localhost:3000/subscribers/1/subscribe/1

# Subscribe user2 (ID: 2) to topic (ID: 1)
curl -X POST http://localhost:3000/subscribers/2/subscribe/1
```

#### 4. Create Scheduled Content

Create newsletter content with a scheduled send time:

```bash
curl -X POST http://localhost:3000/content \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": 1,
    "title": "This Week in Tech",
    "body": "Here are the latest updates:\n\n1. New framework release\n2. Security updates\n3. Industry news",
    "scheduledAt": "2024-01-15T10:00:00.000Z"
  }'
```

**Note:** The `scheduledAt` date must be in the future. The system will automatically send emails to all subscribers of the topic at the scheduled time.

#### 5. Check Content Status

Monitor your content status:

```bash
# List all content
curl http://localhost:3000/content

# Get specific content details
curl http://localhost:3000/content/1
```

#### 6. View Statistics

Check service statistics:

```bash
curl http://localhost:3000/stats
```

### Complete Workflow Example

Here's a complete example using JavaScript/Node.js:

```javascript
const BASE_URL = 'http://localhost:3000';

// 1. Create a topic
const topic = await fetch(`${BASE_URL}/topics`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Product Updates',
    description: 'Latest product features and improvements'
  })
}).then(r => r.json());

// 2. Add subscribers
const subscriber1 = await fetch(`${BASE_URL}/subscribers`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'alice@example.com' })
}).then(r => r.json());

const subscriber2 = await fetch(`${BASE_URL}/subscribers`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'bob@example.com' })
}).then(r => r.json());

// 3. Subscribe users to topic
await fetch(`${BASE_URL}/subscribers/${subscriber1.id}/subscribe/${topic.id}`, {
  method: 'POST'
});

await fetch(`${BASE_URL}/subscribers/${subscriber2.id}/subscribe/${topic.id}`, {
  method: 'POST'
});

// 4. Create scheduled content
const scheduledDate = new Date();
scheduledDate.setDate(scheduledDate.getDate() + 7); // Schedule for 7 days from now

const content = await fetch(`${BASE_URL}/content`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topicId: topic.id,
    title: 'New Features Released!',
    body: 'We are excited to announce new features...',
    scheduledAt: scheduledDate.toISOString()
  })
}).then(r => r.json());

console.log(`Content scheduled for ${content.scheduledAt}`);
console.log(`Status: ${content.status}`);
```

### Managing Subscriptions

#### Unsubscribe a User

```bash
curl -X DELETE http://localhost:3000/subscribers/1/subscribe/1
```

#### Deactivate a Subscriber

```bash
curl -X PATCH http://localhost:3000/subscribers/1 \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

#### Update Content Before Sending

You can update content as long as it hasn't been sent yet:

```bash
curl -X PATCH http://localhost:3000/content/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "body": "Updated content",
    "scheduledAt": "2024-01-20T10:00:00.000Z"
  }'
```

### Monitoring

#### Health Check

```bash
curl http://localhost:3000/health
```

#### View Email Logs

Check email delivery status for specific content:

```bash
curl http://localhost:3000/content/1
```

The response includes `emailLogs` showing delivery status for each subscriber.

### Common Tasks

#### List All Subscribers for a Topic

```bash
curl http://localhost:3000/topics/1/subscribers
```

#### Get All Content for a Topic

```bash
curl http://localhost:3000/content/topic/1
```

#### Delete Content (before sending)

```bash
curl -X DELETE http://localhost:3000/content/1
```

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

This application is configured for deployment on [Render](https://render.com). The deployment includes:
- Web service (NestJS API)
- PostgreSQL database
- Redis cache

### Prerequisites

- Render account (sign up at https://render.com)
- GitHub repository with your code
- Resend API key (get from https://resend.com)

### Deploy to Render

#### Option 1: Deploy via Render Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing this project

2. **Render will detect `render.yaml`**
   - Render will automatically detect the `render.yaml` file
   - It will create three services:
     - Web service (API)
     - PostgreSQL database
     - Redis cache

3. **Configure Environment Variables**
   - Go to your web service settings
   - Navigate to "Environment" section
   - Add the following environment variables:
     ```
     RESEND_API_KEY=re_your_resend_api_key_here
     SENDER_EMAIL=onboarding@resend.dev
     NODE_ENV=production
     ```

4. **Deploy**
   - Click "Apply" to start deployment
   - Render will automatically:
     - Build the Docker image
     - Run database migrations (via `docker-entrypoint.sh` script)
     - Start the web service
   - Wait for deployment to complete (usually 5-10 minutes)
   - Database migrations run automatically before each deployment via the Docker entrypoint script

5. **Verify Deployment**
   - Check the service logs to ensure migrations completed successfully
   - Visit your service URL: `https://your-service-name.onrender.com`
   - Test the health endpoint: `https://your-service-name.onrender.com/health`

#### Option 2: Manual Service Setup

If you prefer to set up services manually:

1. **Create PostgreSQL Database**
   - Go to Render Dashboard → "New +" → "PostgreSQL"
   - Name: `newsletter-db`
   - Plan: Starter (or higher)
   - Region: Choose closest to you
   - Click "Create Database"
   - Note the connection string

2. **Create Redis Instance**
   - Go to Render Dashboard → "New +" → "Redis"
   - Name: `newsletter-redis`
   - Plan: Starter (or higher)
   - Region: Same as database
   - Click "Create Redis"
   - Note the connection details

3. **Create Web Service**
   - Go to Render Dashboard → "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `newsletter-api`
     - **Environment:** Docker
     - **Dockerfile Path:** `./Dockerfile`
     - **Docker Context:** `.`
     - **Build Command:** (leave empty, handled by Dockerfile)
     - **Start Command:** (leave empty, handled by Dockerfile)
     - **Plan:** Starter (or higher)
     - **Region:** Same as database
   - Add Environment Variables:
     ```
     DATABASE_URL=<from PostgreSQL service>
     REDIS_HOST=<from Redis service>
     REDIS_PORT=<from Redis service>
     REDIS_PASSWORD=<from Redis service>
     RESEND_API_KEY=re_your_key_here
     SENDER_EMAIL=onboarding@resend.dev
     NODE_ENV=production
     PORT=3000
     ```
   - Click "Create Web Service"

4. **Database Migrations**
   - Migrations run automatically via `docker-entrypoint.sh` before the app starts
   - The entrypoint script executes `pnpm exec prisma migrate deploy` automatically
   - No manual migration step needed
   - If migrations fail, check Render logs for details

### Environment Variables

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (auto-set from database service) | `postgresql://user:pass@host:5432/db` |
| `REDIS_HOST` | Redis host address (auto-set from Redis service) | `redis-xxx.render.com` |
| `REDIS_PORT` | Redis port (auto-set from Redis service) | `6379` |
| `REDIS_URL` | Redis connection string (auto-set from Redis service) | `redis://:password@host:6379` |
| `RESEND_API_KEY` | Resend API key (must be set manually) | `re_xxxxxxxxxxxx` |
| `SENDER_EMAIL` | Email address for sending (default: onboarding@resend.dev) | `onboarding@resend.dev` |

#### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Environment | `production` |
| `APP_URL` | Application URL (for unsubscribe links) | `http://localhost:3000` |

### Post-Deployment Verification

1. **Check Health Endpoint**
   ```bash
   curl https://your-app.onrender.com/health
   ```
   Should return:
   ```json
   {
     "status": "healthy",
     "timestamp": "...",
     "checks": {
       "database": { "status": "healthy" },
       "redis": { "status": "healthy" }
     }
   }
   ```

2. **Test API Endpoints**
   ```bash
   # Create a topic
   curl -X POST https://your-app.onrender.com/topics \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Topic", "description": "Test"}'
   ```

3. **Check Logs**
   - Go to Render Dashboard → Your Service → "Logs"
   - Verify no errors during startup
   - Check that Prisma migrations ran successfully

### Database Migrations

Database migrations are **automatically run** on each deployment via the `docker-entrypoint.sh` script, which executes before the application starts:

```bash
# The entrypoint script runs:
pnpm exec prisma migrate deploy
```

This ensures your database schema is always up-to-date with your code. The migrations run automatically on every container start.

**Manual Migration (if needed):**
If you need to run migrations manually, use Render Shell:
1. Go to your web service in Render Dashboard
2. Click "Shell" tab
3. Run:
   ```bash
   cd /opt/render/project/src
   pnpm prisma migrate deploy
   ```

**Option 2: Using SSH (if enabled)**
```bash
ssh your-service@ssh.render.com
cd /opt/render/project/src
pnpm prisma migrate deploy
```

**Option 3: Using Render CLI**
```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Run migrations via shell
render shell:run --service newsletter-api "pnpm prisma migrate deploy"
```

### Troubleshooting

#### Build Fails
- Check Dockerfile syntax
- Verify all dependencies are in `package.json`
- Check build logs in Render Dashboard

#### Database Connection Errors
- Verify `DATABASE_URL` is set correctly
- Check database is running and accessible
- Ensure database migrations have run

#### Redis Connection Errors
- Verify Redis environment variables are set
- Check Redis service is running
- Ensure Redis credentials are correct

#### Application Crashes
- Check application logs in Render Dashboard
- Verify all environment variables are set
- Check health endpoint for service status
- Ensure Prisma Client is generated (`pnpm prisma generate`)

#### Email Not Sending
- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard for API key status
- Verify `SENDER_EMAIL` is configured
- Check email logs in application logs

### Local Development vs Production

| Aspect | Local | Production (Render) |
|--------|-------|---------------------|
| Database | Docker Compose PostgreSQL | Render PostgreSQL |
| Redis | Docker Compose Redis | Render Redis |
| Environment | `.env` file | Render Environment Variables |
| Migrations | `pnpm prisma migrate dev` | Automatic (via `releaseCommand`) |
| Build | `pnpm build` | Docker build |
| Start | `pnpm start:dev` | Docker CMD |

### Custom Domain Setup

1. Go to your web service in Render Dashboard
2. Navigate to "Settings" → "Custom Domains"
3. Add your domain
4. Follow DNS configuration instructions
5. Render will automatically provision SSL certificate

### Monitoring

- **Health Checks:** Render automatically monitors `/health` endpoint
- **Logs:** View real-time logs in Render Dashboard
- **Metrics:** Basic metrics available in Render Dashboard
- **Alerts:** Configure alerts in Render Dashboard for service failures

### Production URL

The service is deployed at: **https://newsletter-api-wujw.onrender.com**

You can test the API using this URL:
```bash
curl https://newsletter-api-wujw.onrender.com/health
```

### Cost Estimation

Render pricing (as of 2024):
- **Web Service (Free):** $0/month (with limitations)
- **PostgreSQL (Free):** $0/month (with limitations)
- **Redis (Free):** $0/month (with limitations)
- **Total:** $0/month (Free tier)

**Note:** The free tier has limitations:
- Services may spin down after inactivity
- Limited database storage
- Limited Redis memory
- For production use, consider upgrading to paid plans (Starter: $7/month per service)

### Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Docker Guide](https://render.com/docs/docker)
- [Render Environment Variables](https://render.com/docs/environment-variables)

## Testing Email Scheduling

To test the automatic email scheduling feature:

```bash
# Use the provided test script
./test-email-scheduling.sh https://newsletter-api-wujw.onrender.com 30

# Or manually:
# 1. Create a subscriber
curl -X POST https://newsletter-api-wujw.onrender.com/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'

# 2. Create a topic (or use existing)
curl -X POST https://newsletter-api-wujw.onrender.com/topics \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Topic", "description": "Test"}'

# 3. Subscribe to topic
curl -X POST https://newsletter-api-wujw.onrender.com/subscribers/1/subscribe/1

# 4. Create content scheduled for 30 seconds from now
curl -X POST https://newsletter-api-wujw.onrender.com/content \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": 1,
    "title": "Test Newsletter",
    "body": "This is a test email",
    "scheduledAt": "2024-01-15T10:00:30.000Z"
  }'

# 5. Wait and check status
curl https://newsletter-api-wujw.onrender.com/content/1
```

## Additional Resources

- **Production API:** https://newsletter-api-wujw.onrender.com
- **Swagger API Docs:** https://newsletter-api-wujw.onrender.com/api
- **Health Check:** https://newsletter-api-wujw.onrender.com/health
- **API Documentation:** See "API Endpoints" section above or use Swagger UI
- **Improvements & Pitfalls:** See `IMPROVEMENTS_AND_PITFALLS.md`
- **Testing Guide:** See `TESTING_GUIDE.md`
- **Deployment Guide:** See `RENDER_DEPLOYMENT_GUIDE.md`

## License

MIT
