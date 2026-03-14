import { z } from 'zod';

export const pageViewBodySchema = z.object({
  path: z.string().trim().min(1).max(512),
  url: z.string().trim().min(1).max(2048),
  title: z.string().trim().min(1).max(512).nullable().optional(),
  referrer: z.string().trim().min(1).max(2048).nullable().optional(),
  source: z.string().trim().min(1).max(64).optional(),
  siteId: z.string().trim().min(1).max(64).optional(),
  siteHost: z.string().trim().min(1).max(255).optional(),
  attribution: z
    .object({
      source: z.string().trim().min(1).max(120),
      medium: z.string().trim().min(1).max(120).optional(),
      campaign: z.string().trim().min(1).max(160).optional(),
    })
    .optional(),
});

export type PageViewBodyInput = z.infer<typeof pageViewBodySchema>;
