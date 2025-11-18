import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const updateSubscriberSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateSubscriberDto = z.infer<typeof updateSubscriberSchema>;

export class UpdateSubscriberDtoClass {
  @ApiProperty({
    description: 'Email address of the subscriber',
    example: 'user@example.com',
    format: 'email',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Whether the subscriber is active',
    example: true,
    required: false,
  })
  isActive?: boolean;
}
