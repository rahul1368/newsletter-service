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
import { TopicsService } from './topics.service';
import {
  type CreateTopicDto,
  createTopicSchema,
  CreateTopicDtoClass,
} from './dto/create-topic.dto';
import {
  type UpdateTopicDto,
  updateTopicSchema,
  UpdateTopicDtoClass,
} from './dto/update-topic.dto';
import { createZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiBody({ type: CreateTopicDtoClass })
  @ApiResponse({
    status: 201,
    description: 'Topic created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Topic name already exists' })
  create(
    @Body(createZodValidationPipe(createTopicSchema))
    createTopicDto: CreateTopicDto,
  ) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all topics' })
  @ApiResponse({
    status: 200,
    description: 'List of all topics',
  })
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a topic by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Topic ID' })
  @ApiResponse({
    status: 200,
    description: 'Topic details',
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.findOne(id);
  }

  @Get(':id/subscribers')
  @ApiOperation({ summary: 'Get all subscribers for a topic' })
  @ApiParam({ name: 'id', type: Number, description: 'Topic ID' })
  @ApiResponse({
    status: 200,
    description: 'List of subscribers subscribed to the topic',
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  getSubscribers(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.getSubscribers(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a topic' })
  @ApiParam({ name: 'id', type: Number, description: 'Topic ID' })
  @ApiBody({ type: UpdateTopicDtoClass })
  @ApiResponse({
    status: 200,
    description: 'Topic updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(createZodValidationPipe(updateTopicSchema))
    updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a topic' })
  @ApiParam({ name: 'id', type: Number, description: 'Topic ID' })
  @ApiResponse({
    status: 200,
    description: 'Topic deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.remove(id);
  }
}
