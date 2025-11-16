import { z } from 'zod';

export const subscribeSchema = z.object({
  subscriberId: z
    .number()
    .int()
    .positive('Subscriber ID must be a positive integer'),
  topicId: z.number().int().positive('Topic ID must be a positive integer'),
});

export type SubscribeDto = z.infer<typeof subscribeSchema>;
