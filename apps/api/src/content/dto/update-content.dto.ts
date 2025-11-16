import { z } from 'zod';

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
