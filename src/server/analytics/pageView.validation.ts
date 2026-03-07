import { z } from 'zod';

export const pageViewBodySchema = z.object({
  path: z.string().trim().min(1).max(512),
  url: z.string().trim().min(1).max(2048),
  title: z.string().trim().min(1).max(512).nullable().optional(),
  referrer: z.string().trim().min(1).max(2048).nullable().optional(),
  source: z.string().trim().min(1).max(64).optional(),
});

export type PageViewBodyInput = z.infer<typeof pageViewBodySchema>;
