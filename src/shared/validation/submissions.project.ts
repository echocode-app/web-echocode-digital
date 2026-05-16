import { z } from 'zod';
import {
  projectIdentitySchema,
  projectNeedsSchema,
  turnstileTokenSchema,
} from '@/shared/validation/submissions.common';
import { projectAttachmentSchema } from '@/shared/validation/submissions.files';

/** Project form payload from "Contact Us" modal, including anti-bot verification. */
export const projectSubmissionSchema = projectIdentitySchema.extend({
  formType: z.literal('project'),
  turnstileToken: turnstileTokenSchema,
  needs: projectNeedsSchema.optional(),
  attachment: projectAttachmentSchema.optional(),
});

export type ProjectSubmissionInput = z.infer<typeof projectSubmissionSchema>;
