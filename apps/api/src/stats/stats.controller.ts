import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatsService, ServiceStats } from './stats.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get service statistics',
    description:
      'Returns comprehensive statistics about subscribers, topics, subscriptions, content, and email delivery',
  })
  @ApiResponse({
    status: 200,
    description: 'Service statistics',
    schema: {
      type: 'object',
      properties: {
        subscribers: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            active: { type: 'number' },
            inactive: { type: 'number' },
          },
        },
        topics: {
          type: 'object',
          properties: {
            total: { type: 'number' },
          },
        },
        subscriptions: {
          type: 'object',
          properties: {
            total: { type: 'number' },
          },
        },
        content: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            pending: { type: 'number' },
            sent: { type: 'number' },
            failed: { type: 'number' },
          },
        },
        emails: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            sent: { type: 'number' },
            failed: { type: 'number' },
          },
        },
      },
    },
  })
  async getStats(): Promise<ServiceStats> {
    return this.statsService.getStats();
  }
}
