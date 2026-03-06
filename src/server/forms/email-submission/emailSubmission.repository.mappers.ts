import { Timestamp } from 'firebase-admin/firestore';
import {
  assertTimestamp,
  mapComments,
  toIso,
  toModerationStatus,
} from '@/server/forms/shared/moderation.repository';
import type {
  EmailSubmissionCursor,
  EmailSubmissionListItemDto,
  EmailSubmissionRecordDto,
} from '@/server/forms/email-submission/emailSubmission.types';

function mapSubmissionSource(value: unknown): string {
  return typeof value === 'string' ? value : 'footer_mobile';
}

export function mapEmailSubmissionDocToCursor(
  doc: FirebaseFirestore.QueryDocumentSnapshot,
): EmailSubmissionCursor {
  const createdAt = doc.data().createdAt;
  assertTimestamp(createdAt, `email_submissions/${doc.id}.createdAt`);

  return { createdAtMs: createdAt.toMillis(), id: doc.id };
}

export function mapEmailSubmissionDocToListItem(
  doc: FirebaseFirestore.QueryDocumentSnapshot,
): EmailSubmissionListItemDto {
  const data = doc.data();
  assertTimestamp(data.createdAt, `email_submissions/${doc.id}.createdAt`);

  const commentsCount = Array.isArray(data.comments) ? data.comments.length : 0;

  return {
    id: doc.id,
    email: typeof data.email === 'string' ? data.email : '',
    source: mapSubmissionSource(data.source),
    date: toIso(data.createdAt),
    status: toModerationStatus(data.status),
    commentsCount: Number.isFinite(commentsCount) && commentsCount > 0 ? Math.trunc(commentsCount) : 0,
  };
}

export function mapEmailSubmissionDocToRecord(
  id: string,
  data: Record<string, unknown>,
): EmailSubmissionRecordDto {
  assertTimestamp(data.createdAt, `email_submissions/${id}.createdAt`);
  assertTimestamp(data.updatedAt, `email_submissions/${id}.updatedAt`);

  const reviewedAt = data.reviewedAt;
  const reviewedAtIso = reviewedAt instanceof Timestamp ? toIso(reviewedAt) : null;

  return {
    id,
    email: typeof data.email === 'string' ? data.email : '',
    source: mapSubmissionSource(data.source),
    status: toModerationStatus(data.status),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    reviewedBy: typeof data.reviewedBy === 'string' ? data.reviewedBy : null,
    reviewedAt: reviewedAtIso,
    comments: mapComments(data.comments),
  };
}
