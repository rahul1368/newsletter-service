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
import { createZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(createZodValidationPipe(createTopicSchema))
    createTopicDto: CreateTopicDto,
  ) {
    return this.topicsService.create(createTopicDto);
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
    @Body(createZodValidationPipe(updateTopicSchema))
    updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.topicsService.remove(id);
  }
}
