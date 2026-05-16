import { z } from 'zod';
import {
  profileUrlSchema,
  turnstileTokenSchema,
} from '@/shared/validation/submissions.common';
import { candidateCvFileSchema } from '@/shared/validation/submissions.files';

/** Candidate form payload: CV + profile link + anti-bot verification. */
export const candidateSubmissionSchema = z.object({
  formType: z.literal('candidate'),
  turnstileToken: turnstileTokenSchema,
  profileUrl: profileUrlSchema,
  cvFile: candidateCvFileSchema,
});

export type CandidateSubmissionInput = z.infer<typeof candidateSubmissionSchema>;
