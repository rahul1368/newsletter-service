import { z } from 'zod';

export const createSubscriberSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

export type CreateSubscriberDto = z.infer<typeof createSubscriberSchema>;
