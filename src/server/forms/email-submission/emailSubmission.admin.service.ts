import { ApiError } from '@/server/lib/errors';
import {
  attachAdminProfilesToComments,
  getAdminUserProfileByUid,
} from '@/server/admin/admin-users.service';
import {
  addEmailSubmissionComment,
  getEmailSubmissionById,
  getEmailSubmissionsOverview,
  listEmailSubmissions,
  softDeleteEmailSubmission,
  updateEmailSubmissionStatus,
} from '@/server/forms/email-submission/emailSubmission.repository';
import {
  assertSupportedEmailSubmissionStatus,
  logEmailSubmissionComment,
  logEmailSubmissionSoftDelete,
  logEmailSubmissionStatusUpdate,
} from '@/server/forms/email-submission/emailSubmission.admin.shared';
import {
  decodeEmailSubmissionCursor,
  encodeEmailSubmissionCursor,
} from '@/server/forms/email-submission/emailSubmission.validation';
import type {
  AddEmailSubmissionCommentResponseDto,
  EmailSubmissionDetailsDto,
  EmailSubmissionListQueryInput,
  EmailSubmissionsListResponseDto,
  EmailSubmissionsOverviewDto,
  SoftDeleteEmailSubmissionResponseDto,
  UpdateEmailSubmissionStatusResponseDto,
} from '@/server/forms/email-submission/emailSubmission.types';
import { readThroughTtlCache } from '@/server/lib/ttlCache';

const OVERVIEW_CACHE_TTL_MS = 20_000;

export async function listAdminEmailSubmissions(
  query: EmailSubmissionListQueryInput,
): Promise<EmailSubmissionsListResponseDto> {
  let cursor = undefined;

  if (query.cursor) {
    try {
      cursor = decodeEmailSubmissionCursor(query.cursor);
    } catch {
      throw ApiError.fromCode('INVALID_PAGINATION', 'Invalid cursor');
    }
  }

  const result = await listEmailSubmissions({
    limit: query.limit,
    cursor,
    status: query.status,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  });

  return {
    items: result.items,
    page: {
      limit: query.limit,
      nextCursor: result.nextCursor ? encodeEmailSubmissionCursor(result.nextCursor) : null,
      hasNextPage: result.hasNextPage,
    },
  };
}

export async function getAdminEmailSubmissionsOverview(): Promise<EmailSubmissionsOverviewDto> {
  return readThroughTtlCache('admin:overview:email-submissions', OVERVIEW_CACHE_TTL_MS, () =>
    getEmailSubmissionsOverview(),
  );
}

async function attachEmailSubmissionReviewerProfile(
  item: EmailSubmissionDetailsDto['item'],
): Promise<EmailSubmissionDetailsDto> {
  return {
    item: {
      ...item,
      comments: await attachAdminProfilesToComments(item.comments ?? []),
      reviewedByProfile: await getAdminUserProfileByUid(item.reviewedBy),
    },
  };
}

async function autoMarkEmailSubmissionViewed(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<EmailSubmissionDetailsDto> {
  const update = await updateEmailSubmissionStatus({
    submissionId: input.submissionId,
    status: 'viewed',
    adminUid: input.adminUid,
  });

  await logEmailSubmissionStatusUpdate({
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
    submissionId: input.submissionId,
    previousStatus: update.previousStatus,
    newStatus: 'viewed',
  });

  const refreshed = await getEmailSubmissionById(input.submissionId);
  if (!refreshed) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Failed to reload email submission after auto-view update',
    );
  }

  return attachEmailSubmissionReviewerProfile(refreshed);
}

export async function getAdminEmailSubmissionDetails(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<EmailSubmissionDetailsDto> {
  const item = await getEmailSubmissionById(input.submissionId);

  if (!item) {
    throw ApiError.fromCode('BAD_REQUEST', `Email submission "${input.submissionId}" not found`);
  }

  if (item.status === 'new') {
    return autoMarkEmailSubmissionViewed(input);
  }

  return attachEmailSubmissionReviewerProfile(item);
}

export async function setAdminEmailSubmissionStatus(input: {
  submissionId: string;
  status: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<UpdateEmailSubmissionStatusResponseDto> {
  assertSupportedEmailSubmissionStatus(input.status);

  const existing = await getEmailSubmissionById(input.submissionId);
  if (!existing) {
    throw ApiError.fromCode('BAD_REQUEST', `Email submission "${input.submissionId}" not found`);
  }

  if (existing.status !== 'new' && input.status === 'new') {
    throw ApiError.fromCode(
      'BAD_REQUEST',
      'Status cannot be changed back to "new" after initial processing',
    );
  }

  const update = await updateEmailSubmissionStatus({
    submissionId: input.submissionId,
    status: input.status,
    adminUid: input.adminUid,
  });

  await logEmailSubmissionStatusUpdate({
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
    submissionId: input.submissionId,
    previousStatus: update.previousStatus,
    newStatus: input.status,
  });

  return update.updated;
}

export async function addAdminEmailSubmissionComment(input: {
  submissionId: string;
  comment: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<AddEmailSubmissionCommentResponseDto> {
  const created = await addEmailSubmissionComment({
    submissionId: input.submissionId,
    comment: input.comment,
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
  });

  await logEmailSubmissionComment({
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
    submissionId: input.submissionId,
    comment: input.comment,
    created,
  });

  return created;
}

export async function softDeleteAdminEmailSubmission(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<SoftDeleteEmailSubmissionResponseDto> {
  const result = await softDeleteEmailSubmission({
    submissionId: input.submissionId,
    adminUid: input.adminUid,
  });

  await logEmailSubmissionSoftDelete({
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
    submissionId: input.submissionId,
    deletedAt: result.updatedAt,
  });

  return result;
}
