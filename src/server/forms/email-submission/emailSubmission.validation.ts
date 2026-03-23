import { z } from 'zod';
import { validate } from '@/server/lib';
import {
  decodeModerationCursor,
  encodeModerationCursor,
  moderationCommentSchema,
  moderationListQuerySchema,
  moderationSubmissionIdQuerySchema,
  moderationUpdateStatusSchema,
} from '@/server/forms/shared/moderation.validation';
import type {
  EmailSubmissionCreateInput,
  EmailSubmissionCursor,
  EmailSubmissionListQueryInput,
} from '@/server/forms/email-submission/emailSubmission.types';

const EMAIL_MAX_LEN = 120;

export const emailSubmissionCreateSchema = z.object({
  email: z.string().trim().email('Must be a valid email').max(EMAIL_MAX_LEN, 'Email is too long'),
  source: z.string().trim().min(1).max(80).optional(),
});

export const emailSubmissionListQuerySchema = moderationListQuerySchema;
export const updateEmailSubmissionStatusSchema = moderationUpdateStatusSchema;
export const addEmailSubmissionCommentSchema = moderationCommentSchema;
export const emailSubmissionIdQuerySchema = moderationSubmissionIdQuerySchema;

export function parseEmailSubmissionCreatePayload(input: unknown): EmailSubmissionCreateInput {
  return validate(emailSubmissionCreateSchema, input);
}

export function parseEmailSubmissionListQuery(input: unknown): EmailSubmissionListQueryInput {
  return validate(emailSubmissionListQuerySchema, input);
}

export function decodeEmailSubmissionCursor(raw: string): EmailSubmissionCursor {
  return decodeModerationCursor(raw);
}

export function encodeEmailSubmissionCursor(cursor: EmailSubmissionCursor): string {
  return encodeModerationCursor(cursor);
}
