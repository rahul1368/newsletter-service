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
import { ContentService } from './content.service';
import {
  type CreateContentDto,
  createContentSchema,
} from './dto/create-content.dto';
import {
  type UpdateContentDto,
  updateContentSchema,
} from './dto/update-content.dto';
import { createZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(createZodValidationPipe(createContentSchema))
    createContentDto: CreateContentDto,
  ) {
    return this.contentService.create(createContentDto);
  }

  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.findOne(id);
  }

  @Get('topic/:topicId')
  findByTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.contentService.findByTopic(topicId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(createZodValidationPipe(updateContentSchema))
    updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.remove(id);
  }
}
