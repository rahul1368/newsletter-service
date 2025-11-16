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

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createContentDto: CreateContentDto) {
    // Validate with Zod schema
    const validated = createContentSchema.parse(createContentDto);
    return this.contentService.create(validated);
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
    @Body() updateContentDto: UpdateContentDto,
  ) {
    // Validate with Zod schema
    const validated = updateContentSchema.parse(updateContentDto);
    return this.contentService.update(id, validated);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.remove(id);
  }
}
