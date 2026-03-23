import { ApiError } from '@/server/lib/errors';
import { logAdminAction } from '@/server/admin/admin-logs.service';
import { MODERATION_STATUSES } from '@/server/forms/shared/moderation.types';
import type { AddEmailSubmissionCommentResponseDto, UpdateEmailSubmissionStatusResponseDto } from '@/server/forms/email-submission/emailSubmission.types';

const STATUS_OPTIONS = MODERATION_STATUSES;

export function assertSupportedEmailSubmissionStatus(
  status: string,
): asserts status is UpdateEmailSubmissionStatusResponseDto['status'] {
  if (!STATUS_OPTIONS.includes(status as (typeof STATUS_OPTIONS)[number])) {
    throw ApiError.fromCode('BAD_REQUEST', `Unsupported status: ${status}`);
  }
}

export async function logEmailSubmissionStatusUpdate(input: {
  adminUid: string;
  adminEmail: string | null;
  submissionId: string;
  previousStatus: string;
  newStatus: string;
}): Promise<void> {
  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'email_submission.status_update',
    entityType: 'email_submission',
    entityId: input.submissionId,
    metadata: {
      previousStatus: input.previousStatus,
      newStatus: input.newStatus,
      actorEmail: input.adminEmail,
    },
  });
}

export async function logEmailSubmissionComment(input: {
  adminUid: string;
  adminEmail: string | null;
  submissionId: string;
  comment: string;
  created: AddEmailSubmissionCommentResponseDto;
}): Promise<void> {
  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'email_submission.comment_add',
    entityType: 'email_submission',
    entityId: input.submissionId,
    metadata: {
      commentId: input.created.comment.id,
      commentPreview: input.comment.slice(0, 120),
      actorEmail: input.adminEmail,
    },
  });
}

export async function logEmailSubmissionSoftDelete(input: {
  adminUid: string;
  adminEmail: string | null;
  submissionId: string;
  deletedAt: string;
}): Promise<void> {
  void input;
}
