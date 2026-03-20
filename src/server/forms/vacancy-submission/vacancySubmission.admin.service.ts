import { ApiError } from '@/server/lib/errors';
import {
  attachAdminProfilesToComments,
  getAdminUserProfileByUid,
} from '@/server/admin/admin-users.service';
import {
  addVacancySubmissionComment,
  getVacancySubmissionById,
  getVacancySubmissionsOverview,
  listVacancySubmissions,
  softDeleteVacancySubmission,
  updateVacancySubmissionStatus,
} from '@/server/forms/vacancy-submission/vacancySubmission.repository';
import {
  assertSupportedVacancySubmissionStatus,
  logVacancySubmissionComment,
  logVacancySubmissionSoftDelete,
  logVacancySubmissionStatusUpdate,
} from '@/server/forms/vacancy-submission/vacancySubmission.admin.shared';
import {
  decodeVacancySubmissionCursor,
  encodeVacancySubmissionCursor,
} from '@/server/forms/vacancy-submission/vacancySubmission.validation';
import { getVacancySubmissionCvReadUrl } from '@/server/forms/vacancy-submission/vacancySubmission.files.service';
import type {
  AddVacancySubmissionCommentResponseDto,
  SoftDeleteVacancySubmissionResponseDto,
  UpdateVacancySubmissionStatusResponseDto,
  VacancySubmissionDetailsDto,
  VacancySubmissionListQueryInput,
  VacancySubmissionsListResponseDto,
  VacancySubmissionsOverviewDto,
} from '@/server/forms/vacancy-submission/vacancySubmission.types';
import { readThroughTtlCache } from '@/server/lib/ttlCache';

const OVERVIEW_CACHE_TTL_MS = 20_000;

export async function listAdminVacancySubmissions(
  query: VacancySubmissionListQueryInput,
): Promise<VacancySubmissionsListResponseDto> {
  let cursor = undefined;

  if (query.cursor) {
    try {
      cursor = decodeVacancySubmissionCursor(query.cursor);
    } catch {
      throw ApiError.fromCode('INVALID_PAGINATION', 'Invalid cursor');
    }
  }

  const result = await listVacancySubmissions({
    limit: query.limit,
    cursor,
    status: query.status,
    vacancyKey: query.vacancyKey,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  });

  return {
    items: result.items,
    page: {
      limit: query.limit,
      nextCursor: result.nextCursor ? encodeVacancySubmissionCursor(result.nextCursor) : null,
      hasNextPage: result.hasNextPage,
    },
  };
}

export async function getAdminVacancySubmissionsOverview(): Promise<VacancySubmissionsOverviewDto> {
  return readThroughTtlCache('admin:overview:vacancy-submissions', OVERVIEW_CACHE_TTL_MS, () =>
    getVacancySubmissionsOverview(),
  );
}

async function attachVacancySubmissionCvUrl(
  item: VacancySubmissionDetailsDto['item'],
): Promise<VacancySubmissionDetailsDto> {
  let cvUrl: string | null = null;

  if (item.cvFile.path) {
    try {
      // Details view should stay usable even if the file cannot be signed right now.
      cvUrl = await getVacancySubmissionCvReadUrl(item.cvFile.path);
    } catch {
      cvUrl = null;
    }
  }

  return {
    item: {
      ...item,
      cvUrl,
      comments: await attachAdminProfilesToComments(item.comments ?? []),
      reviewedByProfile: await getAdminUserProfileByUid(item.reviewedBy),
    },
  };
}

async function autoMarkVacancySubmissionViewed(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<VacancySubmissionDetailsDto> {
  const update = await updateVacancySubmissionStatus({
    submissionId: input.submissionId,
    status: 'viewed',
    adminUid: input.adminUid,
  });

  await logVacancySubmissionStatusUpdate({
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
    submissionId: input.submissionId,
    previousStatus: update.previousStatus,
    newStatus: 'viewed',
  });

  const refreshed = await getVacancySubmissionById(input.submissionId);
  if (!refreshed) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Failed to reload vacancy submission after auto-view update',
    );
  }

  return attachVacancySubmissionCvUrl(refreshed);
}

export async function getAdminVacancySubmissionDetails(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<VacancySubmissionDetailsDto> {
  const item = await getVacancySubmissionById(input.submissionId);

  if (!item) {
    throw ApiError.fromCode('BAD_REQUEST', `Vacancy submission "${input.submissionId}" not found`);
  }

  if (item.status === 'new') {
    return autoMarkVacancySubmissionViewed(input);
  }

  return attachVacancySubmissionCvUrl(item);
}

export async function setAdminVacancySubmissionStatus(input: {
  submissionId: string;
  status: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<UpdateVacancySubmissionStatusResponseDto> {
  assertSupportedVacancySubmissionStatus(input.status);

  const existing = await getVacancySubmissionById(input.submissionId);
  if (!existing) {
    throw ApiError.fromCode('BAD_REQUEST', `Vacancy submission "${input.submissionId}" not found`);
  }

  if (existing.status !== 'new' && input.status === 'new') {
    throw ApiError.fromCode(
      'BAD_REQUEST',
      'Status cannot be changed back to "new" after initial processing',
    );
  }

  const update = await updateVacancySubmissionStatus({
    submissionId: input.submissionId,
    status: input.status,
    adminUid: input.adminUid,
  });

  await logVacancySubmissionStatusUpdate({
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
    submissionId: input.submissionId,
    previousStatus: update.previousStatus,
    newStatus: input.status,
  });

  return update.updated;
}

export async function addAdminVacancySubmissionComment(input: {
  submissionId: string;
  comment: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<AddVacancySubmissionCommentResponseDto> {
  const created = await addVacancySubmissionComment({
    submissionId: input.submissionId,
    comment: input.comment,
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
  });

  await logVacancySubmissionComment({
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
    submissionId: input.submissionId,
    comment: input.comment,
    created,
  });

  return created;
}

export async function softDeleteAdminVacancySubmission(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<SoftDeleteVacancySubmissionResponseDto> {
  const result = await softDeleteVacancySubmission({
    submissionId: input.submissionId,
    adminUid: input.adminUid,
  });

  await logVacancySubmissionSoftDelete({
    adminUid: input.adminUid,
    adminEmail: input.adminEmail,
    submissionId: input.submissionId,
    deletedAt: result.updatedAt,
  });

  return result;
}
