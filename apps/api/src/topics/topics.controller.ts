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
import { TopicsService } from './topics.service';
import { type CreateTopicDto, createTopicSchema } from './dto/create-topic.dto';
import { type UpdateTopicDto, updateTopicSchema } from './dto/update-topic.dto';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTopicDto: CreateTopicDto) {
    // Validate with Zod schema
    const validated = createTopicSchema.parse(createTopicDto);
    return this.topicsService.create(validated);
  }

  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.findOne(id);
  }

  @Get(':id/subscribers')
  getSubscribers(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.getSubscribers(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    // Validate with Zod schema
    const validated = updateTopicSchema.parse(updateTopicDto);
    return this.topicsService.update(id, validated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.remove(id);
  }
}
