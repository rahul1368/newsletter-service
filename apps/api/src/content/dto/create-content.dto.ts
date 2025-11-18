import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createContentSchema = z.object({
  topicId: z.number().int().positive('Topic ID must be a positive integer'),
  title: z.string().min(1, 'Title is required').max(255).trim(),
  body: z.string().min(1, 'Body is required'),
  scheduledAt: z.coerce.date({
    required_error: 'Scheduled date is required',
    invalid_type_error: 'Invalid date format',
  }),
});

export type CreateContentDto = z.infer<typeof createContentSchema>;

export class CreateContentDtoClass {
  @ApiProperty({
    description: 'ID of the topic this content belongs to',
    example: 1,
    type: Number,
  })
  topicId: number;

  @ApiProperty({
    description: 'Title of the newsletter content',
    example: 'Weekly Tech Roundup',
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    description: 'Body content of the newsletter',
    example: 'This week in tech...',
  })
  body: string;

  @ApiProperty({
    description: 'Scheduled date and time for sending the newsletter (ISO 8601 format)',
    example: '2024-01-15T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  scheduledAt: string | Date;
}
