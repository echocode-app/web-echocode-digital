import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, 'email.min')
    .max(30, 'email.max')
    .email('email.invalid')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'email.domain'),
});
