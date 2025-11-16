import { z } from 'zod';

export const updateSubscriberSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateSubscriberDto = z.infer<typeof updateSubscriberSchema>;

