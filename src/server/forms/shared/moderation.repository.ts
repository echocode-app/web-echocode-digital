import { Timestamp } from 'firebase-admin/firestore';
import { ApiError } from '@/server/lib/errors';
import type {
  ModerationCommentDto,
  ModerationCommentStored,
  ModerationStatus,
  ModerationStatusCountsDto,
} from '@/server/forms/shared/moderation.types';
import { MODERATION_STATUSES } from '@/server/forms/shared/moderation.types';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';

export const MODERATION_SCAN_PAGE_SIZE = 120;

export function toIso(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString();
}

export function assertTimestamp(value: unknown, label: string): asserts value is Timestamp {
  if (!(value instanceof Timestamp)) {
    throw ApiError.fromCode('INTERNAL_ERROR', `${label} timestamp is invalid`);
  }
}

export function isSoftDeleted(data: Record<string, unknown>): boolean {
  return data.isDeleted === true;
}

export function emptyModerationStatusCounts(): ModerationStatusCountsDto {
  return { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS };
}

export function toModerationStatus(value: unknown): ModerationStatus {
  if (typeof value !== 'string') return 'new';
  return MODERATION_STATUSES.includes(value as ModerationStatus)
    ? (value as ModerationStatus)
    : 'new';
}

export function mapComments(commentsValue: unknown): ModerationCommentDto[] {
  const rawComments = Array.isArray(commentsValue) ? commentsValue : [];

  return rawComments
    .map((entry): ModerationCommentDto | null => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null;
      const comment = entry as Partial<ModerationCommentStored>;
      if (!(comment.createdAt instanceof Timestamp) || typeof comment.id !== 'string' || typeof comment.text !== 'string') {
        return null;
      }

      return {
        id: comment.id,
        text: comment.text,
        authorUid: typeof comment.authorUid === 'string' ? comment.authorUid : 'unknown',
        authorEmail: typeof comment.authorEmail === 'string' ? comment.authorEmail : null,
        createdAt: toIso(comment.createdAt),
      };
    })
    .filter((entry): entry is ModerationCommentDto => entry !== null)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
