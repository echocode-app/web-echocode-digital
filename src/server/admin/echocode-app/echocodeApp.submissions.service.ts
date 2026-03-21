import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import {
  attachAdminProfilesToComments,
  getAdminUserProfileByUid,
} from '@/server/admin/admin-users.service';
import { logAdminAction } from '@/server/admin/admin-logs.service';
import {
  getOverviewStats,
  replaceOverviewStats,
} from '@/server/admin/submissions/overviewStats.repository';
import { ApiError } from '@/server/lib/errors';
import { readThroughTtlCache } from '@/server/lib/ttlCache';
import {
  decodeModerationCursor,
  encodeModerationCursor,
} from '@/server/forms/shared/moderation.validation';
import { getSignedProjectAttachmentReadUrl } from '@/server/submissions/submissions.upload.service';
import {
  addSubmissionCommentRecord,
  getSubmissionById,
  softDeleteSubmissionRecord,
  updateSubmissionStatusRecord,
} from '@/server/submissions/submissions.repository';
import {
  isDeletedSubmissionDoc,
  toSubmissionListItemDto,
} from '@/server/submissions/submissions.mapper';
import type {
  EchocodeAppSubmissionListQueryInput,
  SubmissionDetailsDto,
  SubmissionListItemDto,
  SubmissionRecordDto,
  SubmissionWorkflowStatus,
} from '@/server/submissions/submissions.types';
import type {
  EchocodeAppSubmissionCommentDto,
  EchocodeAppSubmissionDeleteDto,
  EchocodeAppSubmissionDetailsDto,
  EchocodeAppSubmissionStatusUpdateDto,
  EchocodeAppSubmissionsDto,
  EchocodeAppSubmissionsOverviewDto,
} from '@/server/admin/echocode-app/echocodeApp.types';
import {
  FALLBACK_SCAN_PAGE_SIZE,
  SITE_ID,
  STATUS_ORDER,
  SUBMISSIONS_OVERVIEW_CACHE_TTL_MS,
} from '@/server/admin/echocode-app/echocodeApp.constants';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';
import { startOfAdminMonth } from '@/shared/time/europeKiev';

function buildEchocodeAppSubmissionsQuery(
  firestore: FirebaseFirestore.Firestore,
  query: EchocodeAppSubmissionListQueryInput,
): FirebaseFirestore.Query {
  let baseQuery: FirebaseFirestore.Query = firestore
    .collection('submissions')
    .where('siteId', '==', SITE_ID);

  if (query.dateFrom) {
    baseQuery = baseQuery.where(
      'createdAt',
      '>=',
      Timestamp.fromDate(new Date(`${query.dateFrom}T00:00:00.000Z`)),
    );
  }

  if (query.dateTo) {
    baseQuery = baseQuery.where(
      'createdAt',
      '<=',
      Timestamp.fromDate(new Date(`${query.dateTo}T23:59:59.999Z`)),
    );
  }

  return baseQuery.orderBy('createdAt', 'desc').orderBy('__name__', 'desc');
}

function normalizeStoredSubmissionStatus(value: unknown): SubmissionWorkflowStatus | null {
  if (
    value === 'new' ||
    value === 'viewed' ||
    value === 'processed' ||
    value === 'rejected' ||
    value === 'deferred'
  ) {
    return value;
  }

  if (value === 'in_review') return 'viewed';
  if (value === 'contacted') return 'processed';
  if (value === 'closed') return 'deferred';

  return null;
}

function sortRowsByStatusAndDate(rows: SubmissionListItemDto[]): SubmissionListItemDto[] {
  return [...rows].sort((a, b) => {
    const statusDelta = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (statusDelta !== 0) return statusDelta;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function emptyStatusCounts(): EchocodeAppSubmissionsOverviewDto['byStatus'] {
  return { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS };
}

async function listScopedSubmissionRows(
  query: EchocodeAppSubmissionListQueryInput,
): Promise<EchocodeAppSubmissionsDto> {
  const firestore = getFirestoreDb();
  const baseQuery = buildEchocodeAppSubmissionsQuery(firestore, query);
  let activeCursor:
    | {
        createdAtMs: number;
        id: string;
      }
    | undefined;

  if (query.cursor) {
    try {
      activeCursor = decodeModerationCursor(query.cursor);
    } catch {
      throw ApiError.fromCode('INVALID_PAGINATION', 'Invalid cursor');
    }
  }

  const rows: FirebaseFirestore.QueryDocumentSnapshot[] = [];
  let scanCursor: FirebaseFirestore.QueryDocumentSnapshot | null = null;
  let exhausted = false;

  while (rows.length < query.limit + 1 && !exhausted) {
    let batchQuery = baseQuery.limit(FALLBACK_SCAN_PAGE_SIZE);

    if (activeCursor && !scanCursor) {
      batchQuery = batchQuery.startAfter(
        Timestamp.fromMillis(activeCursor.createdAtMs),
        activeCursor.id,
      );
    }

    if (scanCursor) {
      batchQuery = batchQuery.startAfter(scanCursor);
    }

    let snapshot: FirebaseFirestore.QuerySnapshot;
    try {
      snapshot = await batchQuery.get();
    } catch (cause) {
      throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load echocode.app submissions', {
        cause,
      });
    }

    if (snapshot.empty) {
      exhausted = true;
      break;
    }

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (isDeletedSubmissionDoc(data)) return;
      if (query.status && normalizeStoredSubmissionStatus(data.status) !== query.status) {
        return;
      }
      if (rows.length < query.limit + 1) {
        rows.push(doc);
      }
    });

    scanCursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
    if (snapshot.size < FALLBACK_SCAN_PAGE_SIZE) {
      exhausted = true;
    }
  }

  const hasNextPage = rows.length > query.limit;
  const pageDocs = hasNextPage ? rows.slice(0, query.limit) : rows;
  const items = sortRowsByStatusAndDate(pageDocs.map(toSubmissionListItemDto));
  const lastDoc = pageDocs[pageDocs.length - 1] ?? null;

  return {
    items,
    page: {
      limit: query.limit,
      nextCursor:
        hasNextPage && lastDoc
          ? encodeModerationCursor({
              createdAtMs: lastDoc.get('createdAt').toDate().getTime(),
              id: lastDoc.id,
            })
          : null,
      hasNextPage,
    },
  };
}

async function attachSubmissionReviewerProfile(
  item: SubmissionRecordDto,
): Promise<SubmissionDetailsDto> {
  const attachment = item.attachments[0] ?? null;
  const attachmentUrl = attachment
    ? await getSignedProjectAttachmentReadUrl(attachment.path)
    : null;

  return {
    item: {
      ...item,
      attachments: attachment
        ? [
            {
              ...attachment,
              url: attachmentUrl,
            },
          ]
        : [],
      comments: await attachAdminProfilesToComments(item.comments ?? []),
      reviewedByProfile: await getAdminUserProfileByUid(item.reviewedBy),
    },
  };
}

function assertSupportedStatus(status: string): asserts status is SubmissionWorkflowStatus {
  if (!(status in STATUS_ORDER)) {
    throw ApiError.fromCode('BAD_REQUEST', `Unsupported status: ${status}`);
  }
}

export async function getAdminEchocodeAppSubmissionsOverview(): Promise<EchocodeAppSubmissionsOverviewDto> {
  return readThroughTtlCache(
    'admin:overview:echocode-app-submissions',
    SUBMISSIONS_OVERVIEW_CACHE_TTL_MS,
    async () => {
      const cachedStats = await getOverviewStats('echocode_app_submissions');
      if (cachedStats) {
        return {
          totals: cachedStats.totals,
          byStatus: cachedStats.byStatus,
        };
      }

      const firestore = getFirestoreDb();
      const now = new Date();
      const monthStart = startOfAdminMonth(now);
      const nextMonthStart = new Date(
        Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1),
      );

      const [allTimeSnapshot, currentMonthSnapshot] = await Promise.all([
        firestore.collection('submissions').where('siteId', '==', SITE_ID).get(),
        firestore
          .collection('submissions')
          .where('siteId', '==', SITE_ID)
          .where('createdAt', '>=', Timestamp.fromDate(monthStart))
          .where('createdAt', '<', Timestamp.fromDate(nextMonthStart))
          .get(),
      ]).catch((cause) => {
        throw ApiError.fromCode(
          'FIREBASE_UNAVAILABLE',
          'Failed to load echocode.app submissions overview',
          { cause },
        );
      });

      const byStatus = emptyStatusCounts();

      allTimeSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (isDeletedSubmissionDoc(data)) return;

        const normalizedStatus = normalizeStoredSubmissionStatus(data.status) ?? 'new';
        byStatus[normalizedStatus] += 1;
      });

      const currentMonth = currentMonthSnapshot.docs.reduce((count, doc) => {
        return isDeletedSubmissionDoc(doc.data()) ? count : count + 1;
      }, 0);

      const allTime = Object.values(byStatus).reduce((total, value) => total + value, 0);
      const overview = {
        totals: {
          currentMonth,
          allTime,
        },
        byStatus,
      };

      await replaceOverviewStats('echocode_app_submissions', {
        totals: overview.totals,
        byStatus: overview.byStatus,
        statusesByMonth: Array.from({ length: 12 }, (_, monthIndex) => ({
          month: String(monthIndex + 1).padStart(2, '0'),
          new: 0,
          viewed: 0,
          processed: 0,
          rejected: 0,
          deferred: 0,
        })),
      }).catch(() => undefined);

      return overview;
    },
  );
}

export async function listAdminEchocodeAppSubmissions(
  query: Omit<EchocodeAppSubmissionListQueryInput, 'siteId'>,
): Promise<EchocodeAppSubmissionsDto> {
  return listScopedSubmissionRows({
    ...query,
    siteId: SITE_ID,
  });
}

export async function getAdminEchocodeAppSubmissionDetails(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<EchocodeAppSubmissionDetailsDto> {
  const item = await getSubmissionById(input.submissionId);

  if (!item || item.siteId !== SITE_ID) {
    throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
  }

  if (item.status === 'new') {
    const update = await updateSubmissionStatusRecord({
      submissionId: input.submissionId,
      status: 'viewed',
      updatedBy: input.adminUid,
    });

    await logAdminAction({
      adminUid: input.adminUid,
      actionType: 'submissions.status.update',
      entityType: 'submission',
      entityId: input.submissionId,
      metadata: {
        previousStatus: update.previousStatus,
        newStatus: 'viewed',
        actorEmail: input.adminEmail,
        siteId: SITE_ID,
      },
    });

    const refreshed = await getSubmissionById(input.submissionId);
    if (!refreshed) {
      throw ApiError.fromCode(
        'INTERNAL_ERROR',
        'Failed to reload echocode.app submission after auto-review update',
      );
    }

    return attachSubmissionReviewerProfile(refreshed);
  }

  return attachSubmissionReviewerProfile(item);
}

export async function setAdminEchocodeAppSubmissionStatus(input: {
  submissionId: string;
  status: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<EchocodeAppSubmissionStatusUpdateDto> {
  assertSupportedStatus(input.status);

  const existing = await getSubmissionById(input.submissionId);
  if (!existing || existing.siteId !== SITE_ID) {
    throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
  }

  if (existing.status !== 'new' && input.status === 'new') {
    throw ApiError.fromCode(
      'BAD_REQUEST',
      'Status cannot be changed back to "new" after initial processing',
    );
  }

  const update = await updateSubmissionStatusRecord({
    submissionId: input.submissionId,
    status: input.status,
    updatedBy: input.adminUid,
  });

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'submissions.status.update',
    entityType: 'submission',
    entityId: input.submissionId,
    metadata: {
      previousStatus: update.previousStatus,
      newStatus: input.status,
      actorEmail: input.adminEmail,
      siteId: SITE_ID,
    },
  });

  return update.updated;
}

export async function addAdminEchocodeAppSubmissionComment(input: {
  submissionId: string;
  comment: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<EchocodeAppSubmissionCommentDto> {
  const existing = await getSubmissionById(input.submissionId);
  if (!existing || existing.siteId !== SITE_ID) {
    throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
  }

  const created = await addSubmissionCommentRecord(input);

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'submissions.comment.add',
    entityType: 'submission',
    entityId: input.submissionId,
    metadata: {
      commentId: created.comment.id,
      commentPreview: input.comment.slice(0, 120),
      actorEmail: input.adminEmail,
      siteId: SITE_ID,
    },
  });

  return created;
}

export async function softDeleteAdminEchocodeAppSubmission(input: {
  submissionId: string;
  adminUid: string;
  adminEmail: string | null;
}): Promise<EchocodeAppSubmissionDeleteDto> {
  const existing = await getSubmissionById(input.submissionId);
  if (!existing || existing.siteId !== SITE_ID) {
    throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
  }

  const deleted = await softDeleteSubmissionRecord({
    submissionId: input.submissionId,
    adminUid: input.adminUid,
  });

  return deleted;
}
