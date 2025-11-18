import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SubscribersService } from './subscribers.service';
import {
  type CreateSubscriberDto,
  createSubscriberSchema,
  CreateSubscriberDtoClass,
} from './dto/create-subscriber.dto';
import {
  type UpdateSubscriberDto,
  updateSubscriberSchema,
  UpdateSubscriberDtoClass,
} from './dto/update-subscriber.dto';
import { createZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new subscriber' })
  @ApiBody({ type: CreateSubscriberDtoClass })
  @ApiResponse({
    status: 201,
    description: 'Subscriber created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(
    @Body(createZodValidationPipe(createSubscriberSchema))
    createSubscriberDto: CreateSubscriberDto,
  ) {
    return this.subscribersService.create(createSubscriberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscribers' })
  @ApiResponse({
    status: 200,
    description: 'List of all subscribers',
  })
  findAll() {
    return this.subscribersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscriber by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Subscriber ID' })
  @ApiResponse({
    status: 200,
    description: 'Subscriber details',
  })
  @ApiResponse({ status: 404, description: 'Subscriber not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subscribersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscriber' })
  @ApiParam({ name: 'id', type: Number, description: 'Subscriber ID' })
  @ApiBody({ type: UpdateSubscriberDtoClass })
  @ApiResponse({
    status: 200,
    description: 'Subscriber updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Subscriber not found' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(createZodValidationPipe(updateSubscriberSchema))
    updateSubscriberDto: UpdateSubscriberDto,
  ) {
    return this.subscribersService.update(id, updateSubscriberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a subscriber' })
  @ApiParam({ name: 'id', type: Number, description: 'Subscriber ID' })
  @ApiResponse({
    status: 200,
    description: 'Subscriber deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Subscriber not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subscribersService.remove(id);
  }
}
