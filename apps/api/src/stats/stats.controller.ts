import { Controller, Get } from '@nestjs/common';
import { StatsService, ServiceStats } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(): Promise<ServiceStats> {
    return this.statsService.getStats();
  }
}
