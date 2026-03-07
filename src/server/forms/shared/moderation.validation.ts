import { z } from 'zod';
import { validate } from '@/server/lib';
import type {
  ModerationCursor,
  ModerationListQueryInput,
  ModerationStatus,
} from '@/server/forms/shared/moderation.types';
import { MODERATION_STATUSES } from '@/server/forms/shared/moderation.types';

export const moderationStatusSchema = z.enum(
  MODERATION_STATUSES as [ModerationStatus, ...ModerationStatus[]],
);

export const moderationListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(20),
  cursor: z.string().trim().min(1).optional(),
  status: moderationStatusSchema.optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});

export const moderationSubmissionIdQuerySchema = z.object({
  submissionId: z.string().trim().min(1),
});

export const moderationCommentSchema = z.object({
  comment: z.string().trim().min(1).max(1200),
});

export const moderationUpdateStatusSchema = z.object({
  status: moderationStatusSchema,
});

export function parseModerationListQuery(input: unknown): ModerationListQueryInput {
  return validate(moderationListQuerySchema, input);
}

export function decodeModerationCursor(raw: string): ModerationCursor {
  const json = Buffer.from(raw, 'base64').toString('utf8');
  const parsed = JSON.parse(json) as { createdAtMs?: unknown; id?: unknown };

  if (
    !Number.isSafeInteger(parsed.createdAtMs) ||
    typeof parsed.id !== 'string' ||
    parsed.id.trim().length === 0
  ) {
    throw new Error('Invalid cursor');
  }

  return {
    createdAtMs: parsed.createdAtMs as number,
    id: parsed.id,
  };
}

export function encodeModerationCursor(cursor: ModerationCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64');
}
