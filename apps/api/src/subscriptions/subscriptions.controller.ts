import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { type SubscribeDto, subscribeSchema } from './dto/subscribe.dto';

@Controller('subscribers')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post(':id/subscribe/:topicId')
  @HttpCode(HttpStatus.CREATED)
  subscribe(
    @Param('id', ParseIntPipe) subscriberId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
  ) {
    // Validate with Zod schema
    const subscribeDto: SubscribeDto = subscribeSchema.parse({
      subscriberId,
      topicId,
    });
    return this.subscriptionsService.subscribe(subscribeDto);
  }

  @Delete(':id/subscribe/:topicId')
  @HttpCode(HttpStatus.OK)
  unsubscribe(
    @Param('id', ParseIntPipe) subscriberId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
  ) {
    return this.subscriptionsService.unsubscribe(subscriberId, topicId);
  }
}
