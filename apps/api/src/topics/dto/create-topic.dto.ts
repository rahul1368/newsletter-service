import { z } from 'zod';

export const createTopicSchema = z.object({
  name: z.string().min(1, 'Topic name is required').max(255).trim(),
  description: z.string().optional(),
});

export type CreateTopicDto = z.infer<typeof createTopicSchema>;
