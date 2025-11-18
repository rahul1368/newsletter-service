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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { type SubscribeDto, subscribeSchema } from './dto/subscribe.dto';

@ApiTags('subscriptions')
@Controller('subscribers')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post(':id/subscribe/:topicId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Subscribe a user to a topic' })
  @ApiParam({ name: 'id', type: Number, description: 'Subscriber ID' })
  @ApiParam({ name: 'topicId', type: Number, description: 'Topic ID' })
  @ApiResponse({
    status: 201,
    description: 'Successfully subscribed to topic',
  })
  @ApiResponse({ status: 404, description: 'Subscriber or topic not found' })
  @ApiResponse({ status: 409, description: 'Already subscribed to this topic' })
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
  @ApiOperation({ summary: 'Unsubscribe a user from a topic' })
  @ApiParam({ name: 'id', type: Number, description: 'Subscriber ID' })
  @ApiParam({ name: 'topicId', type: Number, description: 'Topic ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully unsubscribed from topic',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  unsubscribe(
    @Param('id', ParseIntPipe) subscriberId: number,
    @Param('topicId', ParseIntPipe) topicId: number,
  ) {
    return this.subscriptionsService.unsubscribe(subscriberId, topicId);
  }
}
