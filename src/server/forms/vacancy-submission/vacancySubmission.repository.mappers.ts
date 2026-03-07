import { Timestamp } from 'firebase-admin/firestore';
import {
  assertTimestamp,
  mapComments,
  toIso,
  toModerationStatus,
} from '@/server/forms/shared/moderation.repository';
import {
  mapVacancySnapshot,
  toVacancyKey,
} from '@/server/forms/vacancy-submission/vacancySubmission.repository.shared';
import type {
  VacancySubmissionCursor,
  VacancySubmissionCvInput,
  VacancySubmissionListItemDto,
  VacancySubmissionRecordDto,
} from '@/server/forms/vacancy-submission/vacancySubmission.types';

function mapCvFile(data: Record<string, unknown>): VacancySubmissionCvInput {
  return {
    path: typeof data.cvPath === 'string' ? data.cvPath : '',
    originalName: typeof data.cvName === 'string' ? data.cvName : '',
    mimeType: typeof data.cvMimeType === 'string' ? data.cvMimeType : '',
    sizeBytes:
      typeof data.cvSizeBytes === 'number' && Number.isFinite(data.cvSizeBytes)
        ? data.cvSizeBytes
        : 0,
  };
}

export function mapVacancySubmissionDocToCursor(
  doc: FirebaseFirestore.QueryDocumentSnapshot,
): VacancySubmissionCursor {
  const createdAt = doc.data().createdAt;
  assertTimestamp(createdAt, `vacancy_submissions/${doc.id}.createdAt`);

  return { createdAtMs: createdAt.toMillis(), id: doc.id };
}

export function mapVacancySubmissionDocToListItem(
  doc: FirebaseFirestore.QueryDocumentSnapshot,
): VacancySubmissionListItemDto {
  const data = doc.data();
  assertTimestamp(data.createdAt, `vacancy_submissions/${doc.id}.createdAt`);

  const commentsCount = Array.isArray(data.comments) ? data.comments.length : 0;
  const vacancy = mapVacancySnapshot(data);

  return {
    id: doc.id,
    profileUrl: typeof data.profileUrl === 'string' ? data.profileUrl : '',
    cvName: typeof data.cvName === 'string' ? data.cvName : '',
    vacancy,
    vacancyKey: typeof data.vacancyKey === 'string' ? data.vacancyKey : toVacancyKey(vacancy),
    date: toIso(data.createdAt),
    status: toModerationStatus(data.status),
    commentsCount:
      Number.isFinite(commentsCount) && commentsCount > 0 ? Math.trunc(commentsCount) : 0,
  };
}

export function mapVacancySubmissionDocToRecord(
  id: string,
  data: Record<string, unknown>,
): VacancySubmissionRecordDto {
  assertTimestamp(data.createdAt, `vacancy_submissions/${id}.createdAt`);
  assertTimestamp(data.updatedAt, `vacancy_submissions/${id}.updatedAt`);

  const reviewedAt = data.reviewedAt;
  const reviewedAtIso = reviewedAt instanceof Timestamp ? toIso(reviewedAt) : null;
  const vacancy = mapVacancySnapshot(data);

  return {
    id,
    profileUrl: typeof data.profileUrl === 'string' ? data.profileUrl : '',
    cvFile: mapCvFile(data),
    cvUrl: null,
    vacancy,
    vacancyKey: typeof data.vacancyKey === 'string' ? data.vacancyKey : toVacancyKey(vacancy),
    status: toModerationStatus(data.status),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    reviewedBy: typeof data.reviewedBy === 'string' ? data.reviewedBy : null,
    reviewedByProfile: null,
    reviewedAt: reviewedAtIso,
    comments: mapComments(data.comments),
  };
}
