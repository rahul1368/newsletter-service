import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const updateTopicSchema = z.object({
  name: z.string().min(1, 'Topic name is required').max(255).trim().optional(),
  description: z.string().optional(),
});

export type UpdateTopicDto = z.infer<typeof updateTopicSchema>;

export class UpdateTopicDtoClass {
  @ApiProperty({
    description: 'Name of the topic',
    example: 'Updated Tech News',
    maxLength: 255,
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Optional description of the topic',
    example: 'Updated description',
    required: false,
  })
  description?: string;
}
