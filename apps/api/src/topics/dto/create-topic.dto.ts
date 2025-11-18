import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createTopicSchema = z.object({
  name: z.string().min(1, 'Topic name is required').max(255).trim(),
  description: z.string().optional(),
});

export type CreateTopicDto = z.infer<typeof createTopicSchema>;

export class CreateTopicDtoClass {
  @ApiProperty({
    description: 'Name of the topic',
    example: 'Tech News',
    maxLength: 255,
  })
  name: string;

  @ApiProperty({
    description: 'Optional description of the topic',
    example: 'Latest technology updates and news',
    required: false,
  })
  description?: string;
}
