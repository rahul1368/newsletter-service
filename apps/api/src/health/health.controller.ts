import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  checks: {
    database: {
      status: 'healthy' | 'unhealthy';
      message?: string;
    };
    redis: {
      status: 'healthy' | 'unhealthy';
      message?: string;
    };
  };
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  private redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    // Initialize Redis client for health checks
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: parseInt(
        this.configService.get<string>('REDIS_PORT') || '6379',
        10,
      ),
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      retryStrategy: () => null, // Don't retry for health checks
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Checks the health status of the service and its dependencies (database and Redis)',
  })
  @ApiResponse({
    status: 200,
    description: 'Service health status',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['healthy', 'unhealthy'],
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
        checks: {
          type: 'object',
          properties: {
            database: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['healthy', 'unhealthy'],
                },
                message: { type: 'string', nullable: true },
              },
            },
            redis: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['healthy', 'unhealthy'],
                },
                message: { type: 'string', nullable: true },
              },
            },
          },
        },
      },
    },
  })
  async checkHealth(): Promise<HealthCheckResponse> {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
    };

    const allHealthy =
      checks.database.status === 'healthy' && checks.redis.status === 'healthy';

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  private async checkDatabase(): Promise<{
    status: 'healthy' | 'unhealthy';
    message?: string;
  }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message:
          error instanceof Error ? error.message : 'Database connection failed',
      };
    }
  }

  private async checkRedis(): Promise<{
    status: 'healthy' | 'unhealthy';
    message?: string;
  }> {
    try {
      // Try to connect if not already connected
      if (this.redis.status !== 'ready') {
        await this.redis.connect();
      }
      const result = await this.redis.ping();
      if (result === 'PONG') {
        return { status: 'healthy' };
      }
      return {
        status: 'unhealthy',
        message: 'Redis ping failed',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message:
          error instanceof Error ? error.message : 'Redis connection failed',
      };
    }
  }
}
