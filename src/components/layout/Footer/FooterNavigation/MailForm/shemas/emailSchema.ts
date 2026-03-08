import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, 'Email is too short!')
    .max(30, 'Email is too long!')
    .email('Enter a valid email!')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Domain must contain a dot and be valid!'),
});
