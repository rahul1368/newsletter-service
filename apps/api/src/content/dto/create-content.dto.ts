import { z } from 'zod';

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
