import { z } from 'zod';

export const updateTopicSchema = z.object({
  name: z.string().min(1, 'Topic name is required').max(255).trim().optional(),
  description: z.string().optional(),
});

export type UpdateTopicDto = z.infer<typeof updateTopicSchema>;
