import { ApiError } from '@/server/lib/errors';
import { logAdminAction } from '@/server/admin/admin-logs.service';
import { MODERATION_STATUSES } from '@/server/forms/shared/moderation.types';
import type {
  AddVacancySubmissionCommentResponseDto,
  UpdateVacancySubmissionStatusResponseDto,
} from '@/server/forms/vacancy-submission/vacancySubmission.types';

const STATUS_OPTIONS = MODERATION_STATUSES;

export function assertSupportedVacancySubmissionStatus(
  status: string,
): asserts status is UpdateVacancySubmissionStatusResponseDto['status'] {
  if (!STATUS_OPTIONS.includes(status as (typeof STATUS_OPTIONS)[number])) {
    throw ApiError.fromCode('BAD_REQUEST', `Unsupported status: ${status}`);
  }
}

export async function logVacancySubmissionStatusUpdate(input: {
  adminUid: string;
  adminEmail: string | null;
  submissionId: string;
  previousStatus: string;
  newStatus: string;
}): Promise<void> {
  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'vacancy_submission.status_update',
    entityType: 'vacancy_submission',
    entityId: input.submissionId,
    metadata: {
      previousStatus: input.previousStatus,
      newStatus: input.newStatus,
      actorEmail: input.adminEmail,
    },
  });
}

export async function logVacancySubmissionComment(input: {
  adminUid: string;
  adminEmail: string | null;
  submissionId: string;
  comment: string;
  created: AddVacancySubmissionCommentResponseDto;
}): Promise<void> {
  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'vacancy_submission.comment_add',
    entityType: 'vacancy_submission',
    entityId: input.submissionId,
    metadata: {
      commentId: input.created.comment.id,
      commentPreview: input.comment.slice(0, 120),
      actorEmail: input.adminEmail,
    },
  });
}

export async function logVacancySubmissionSoftDelete(input: {
  adminUid: string;
  adminEmail: string | null;
  submissionId: string;
  deletedAt: string;
}): Promise<void> {
  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'vacancy_submission.soft_delete',
    entityType: 'vacancy_submission',
    entityId: input.submissionId,
    metadata: {
      actorEmail: input.adminEmail,
      deletedAt: input.deletedAt,
    },
  });
}
