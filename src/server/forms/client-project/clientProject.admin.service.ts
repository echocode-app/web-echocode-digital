import { Timestamp } from 'firebase-admin/firestore';
import { ApiError } from '@/server/lib/errors';
import { logAdminAction } from '@/server/admin/admin-logs.service';
import {
  attachAdminProfilesToComments,
  getAdminUserProfileByUid,
} from '@/server/admin/admin-users.service';
import {
  decodeClientSubmissionCursor,
  encodeClientSubmissionCursor,
} from '@/server/forms/client-project/clientProject.validation';
import {
  addClientSubmissionComment,
  getClientSubmissionById,
  getClientSubmissionsOverview,
  listClientSubmissions,
  softDeleteClientSubmission,
  updateClientSubmissionStatus,
} from '@/server/forms/client-project/clientProject.repository';
import type {
  AddClientSubmissionCommentResponseDto,
  ClientSubmissionListQueryInput,
  ClientSubmissionDetailsDto,
  ClientSubmissionsListResponseDto,
  ClientSubmissionsOverviewDto,
  SoftDeleteClientSubmissionResponseDto,
  UpdateClientSubmissionStatusResponseDto,
} from '@/server/forms/client-project/clientProject.types';
import { readThroughTtlCache } from '@/server/lib/ttlCache';
import { CLIENT_SUBMISSION_STATUS_VALUES } from '@/shared/admin/constants';

const STATUS_OPTIONS = [...CLIENT_SUBMISSION_STATUS_VALUES] as const;
const OVERVIEW_CACHE_TTL_MS = 20_000;

function assertSupportedStatus(
  status: string,
): asserts status is UpdateClientSubmissionStatusResponseDto['status'] {
  if (!STATUS_OPTIONS.includes(status as (typeof STATUS_OPTIONS)[number])) {
    throw ApiError.fromCode('BAD_REQUEST', `Unsupported status: ${status}`);
  }
}

export async function listAdminClientSubmissions(
  query: ClientSubmissionListQueryInput,
): Promise<ClientSubmissionsListResponseDto> {
  let cursor = undefined;

  if (query.cursor) {
    try {
      cursor = decodeClientSubmissionCursor(query.cursor);
    } catch {
      throw ApiError.fromCode('INVALID_PAGINATION', 'Invalid cursor');
    }
  }

  const result = await listClientSubmissions({
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
      nextCursor: result.nextCursor ? encodeClientSubmissionCursor(result.nextCursor) : null,
      hasNextPage: result.hasNextPage,
    },
  };
}

export async function getAdminClientSubmissionsOverview(): Promise<ClientSubmissionsOverviewDto> {
  return readThroughTtlCache('admin:overview:client-submissions', OVERVIEW_CACHE_TTL_MS, () =>
    getClientSubmissionsOverview(),
  );
}

async function attachClientSubmissionReviewerProfile(
  item: ClientSubmissionDetailsDto['item'],
): Promise<ClientSubmissionDetailsDto> {
  return {
    item: {
      ...item,
      comments: await attachAdminProfilesToComments(item.comments ?? []),
      reviewedByProfile: await getAdminUserProfileByUid(item.reviewedBy),
    },
  };
}

export async function getAdminClientSubmissionDetails(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<ClientSubmissionDetailsDto> {
  const item = await getClientSubmissionById(input.submissionId);

  if (!item) {
    throw ApiError.fromCode('BAD_REQUEST', `Client submission "${input.submissionId}" not found`);
  }

  if (item.status === 'new') {
    const update = await updateClientSubmissionStatus({
      submissionId: input.submissionId,
      status: 'viewed',
      adminUid: input.adminUid,
    });

    await logAdminAction({
      adminUid: input.adminUid,
      actionType: 'client_submission.status_update',
      entityType: 'client_submission',
      entityId: input.submissionId,
      metadata: {
        previousStatus: update.previousStatus,
        newStatus: 'viewed',
        actorEmail: input.adminEmail,
      },
    });

    const refreshed = await getClientSubmissionById(input.submissionId);
    if (!refreshed) {
      throw ApiError.fromCode(
        'INTERNAL_ERROR',
        'Failed to reload client submission after auto-view update',
      );
    }

    return attachClientSubmissionReviewerProfile(refreshed);
  }

  return attachClientSubmissionReviewerProfile(item);
}

export async function setAdminClientSubmissionStatus(input: {
  submissionId: string;
  status: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<UpdateClientSubmissionStatusResponseDto> {
  assertSupportedStatus(input.status);

  const existing = await getClientSubmissionById(input.submissionId);
  if (!existing) {
    throw ApiError.fromCode('BAD_REQUEST', `Client submission "${input.submissionId}" not found`);
  }

  if (existing.status !== 'new' && input.status === 'new') {
    throw ApiError.fromCode(
      'BAD_REQUEST',
      'Status cannot be changed back to "new" after initial processing',
    );
  }

  const update = await updateClientSubmissionStatus({
    submissionId: input.submissionId,
    status: input.status,
    adminUid: input.adminUid,
  });

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'client_submission.status_update',
    entityType: 'client_submission',
    entityId: input.submissionId,
    metadata: {
      previousStatus: update.previousStatus,
      newStatus: input.status,
      actorEmail: input.adminEmail,
    },
  });

  return update.updated;
}

export async function addAdminClientSubmissionComment(input: {
  submissionId: string;
  comment: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<AddClientSubmissionCommentResponseDto> {
  const created = await addClientSubmissionComment({
    submissionId: input.submissionId,
    comment: input.comment,
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
  });

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'client_submission.comment_add',
    entityType: 'client_submission',
    entityId: input.submissionId,
    metadata: {
      commentId: created.comment.id,
      commentPreview: input.comment.slice(0, 120),
      actorEmail: input.adminEmail,
    },
  });

  return created;
}

export async function softDeleteAdminClientSubmission(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<SoftDeleteClientSubmissionResponseDto> {
  const result = await softDeleteClientSubmission({
    submissionId: input.submissionId,
    adminUid: input.adminUid,
  });

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'client_submission.soft_delete',
    entityType: 'client_submission',
    entityId: input.submissionId,
    metadata: {
      actorEmail: input.adminEmail,
      deletedAt: result.updatedAt,
    },
  });

  return result;
}

export const clientSubmissionDateRange = {
  toTimestampBounds(input: { dateFrom?: string; dateTo?: string }): {
    from?: Timestamp;
    to?: Timestamp;
  } {
    return {
      from: input.dateFrom
        ? Timestamp.fromDate(new Date(`${input.dateFrom}T00:00:00.000Z`))
        : undefined,
      to: input.dateTo ? Timestamp.fromDate(new Date(`${input.dateTo}T23:59:59.999Z`)) : undefined,
    };
  },
};
