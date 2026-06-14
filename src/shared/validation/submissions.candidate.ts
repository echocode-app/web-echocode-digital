import { z } from 'zod';
import {
  profileUrlSchema,
  // turnstileTokenSchema,
  captchaTokenSchema,
} from '@/shared/validation/submissions.common';
import { candidateCvFileSchema } from '@/shared/validation/submissions.files';

/** Candidate form payload: CV + profile link + anti-bot verification. */
export const candidateSubmissionSchema = z.object({
  formType: z.literal('candidate'),
  // turnstileToken: turnstileTokenSchema,
  captchaToken: captchaTokenSchema,
  profileUrl: profileUrlSchema,
  cvFile: candidateCvFileSchema,
});

export type CandidateSubmissionInput = z.infer<typeof candidateSubmissionSchema>;
