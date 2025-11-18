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
import { ContentService } from './content.service';
import {
  type CreateContentDto,
  createContentSchema,
  CreateContentDtoClass,
} from './dto/create-content.dto';
import {
  type UpdateContentDto,
  updateContentSchema,
  UpdateContentDtoClass,
} from './dto/update-content.dto';
import { createZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new newsletter content',
    description:
      'Creates content and automatically schedules email delivery to all subscribers of the topic at the scheduled time.',
  })
  @ApiBody({ type: CreateContentDtoClass })
  @ApiResponse({
    status: 201,
    description: 'Content created and scheduled successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  create(
    @Body(createZodValidationPipe(createContentSchema))
    createContentDto: CreateContentDto,
  ) {
    return this.contentService.create(createContentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all content' })
  @ApiResponse({
    status: 200,
    description: 'List of all content, ordered by scheduled time',
  })
  findAll() {
    return this.contentService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get content by ID',
    description: 'Returns detailed content information including email logs',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Content ID' })
  @ApiResponse({
    status: 200,
    description: 'Content details with email logs',
  })
  @ApiResponse({ status: 404, description: 'Content not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.findOne(id);
  }

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Get all content for a specific topic' })
  @ApiParam({ name: 'topicId', type: Number, description: 'Topic ID' })
  @ApiResponse({
    status: 200,
    description: 'List of content for the topic',
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  findByTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.contentService.findByTopic(topicId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update content',
    description: 'Cannot update content that has already been sent',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Content ID' })
  @ApiBody({ type: UpdateContentDtoClass })
  @ApiResponse({
    status: 200,
    description: 'Content updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @ApiResponse({ status: 400, description: 'Validation failed or content already sent' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(createZodValidationPipe(updateContentSchema))
    updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete content',
    description: 'Cannot delete content that has already been sent',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Content ID' })
  @ApiResponse({
    status: 200,
    description: 'Content deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @ApiResponse({ status: 400, description: 'Content already sent' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.remove(id);
  }
}
