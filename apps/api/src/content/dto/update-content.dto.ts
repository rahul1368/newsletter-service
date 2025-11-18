import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const updateContentSchema = z.object({
  topicId: z
    .number()
    .int()
    .positive('Topic ID must be a positive integer')
    .optional(),
  title: z.string().min(1, 'Title is required').max(255).trim().optional(),
  body: z.string().min(1, 'Body is required').optional(),
  scheduledAt: z.coerce
    .date({
      invalid_type_error: 'Invalid date format',
    })
    .optional(),
});

export type UpdateContentDto = z.infer<typeof updateContentSchema>;

export class UpdateContentDtoClass {
  @ApiProperty({
    description: 'ID of the topic this content belongs to',
    example: 1,
    type: Number,
    required: false,
  })
  topicId?: number;

  @ApiProperty({
    description: 'Title of the newsletter content',
    example: 'Updated Weekly Tech Roundup',
    maxLength: 255,
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Body content of the newsletter',
    example: 'Updated content...',
    required: false,
  })
  body?: string;

  @ApiProperty({
    description: 'Scheduled date and time for sending the newsletter (ISO 8601 format)',
    example: '2024-01-20T10:00:00.000Z',
    type: String,
    format: 'date-time',
    required: false,
  })
  scheduledAt?: string | Date;
}
