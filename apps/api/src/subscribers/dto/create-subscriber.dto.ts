import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const createSubscriberSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

export type CreateSubscriberDto = z.infer<typeof createSubscriberSchema>;

export class CreateSubscriberDtoClass {
  @ApiProperty({
    description: 'Email address of the subscriber',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;
}
