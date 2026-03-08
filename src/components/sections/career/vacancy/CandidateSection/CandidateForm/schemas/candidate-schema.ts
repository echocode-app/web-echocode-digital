import { z } from 'zod';

export const applicationSchema = z.object({
  profileUrl: z.string().min(1, 'Link is required').url('Enter a valid URL'),

  path: z.string().min(1, 'Upload your CV'),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;
