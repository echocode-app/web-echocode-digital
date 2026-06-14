import { z } from 'zod';
import {
  projectIdentitySchema,
  projectNeedsSchema,
  // turnstileTokenSchema,
  captchaTokenSchema,
} from '@/shared/validation/submissions.common';
import { projectAttachmentSchema } from '@/shared/validation/submissions.files';

const siteIdSchema = z.enum(['echocode_digital', 'echocode_app']);
const siteHostSchema = z.string().trim().min(1).max(255);
const submissionSourceSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9_-]+$/i, 'Source contains unsupported characters');

/** Project form payload from public contact forms. Captcha policy is site-specific server-side. */
export const projectSubmissionSchema = projectIdentitySchema.extend({
  formType: z.literal('project'),
  siteId: siteIdSchema.optional(),
  siteHost: siteHostSchema.optional(),
  source: submissionSourceSchema.optional(),
  // turnstileToken: turnstileTokenSchema.optional(),
  captchaToken: captchaTokenSchema.optional(),
  needs: projectNeedsSchema.optional(),
  attachment: projectAttachmentSchema.optional(),
});

export type ProjectSubmissionInput = z.infer<typeof projectSubmissionSchema>;
