import type {
  DashboardKpiDto,
  DashboardPeriod,
  TrendDirection,
  TrendStats,
} from '@/server/admin/dashboard/dashboard.types';
import { getFirestoreDb } from '@/server/firebase/firestore';
import {
  attachAdminProfilesToComments,
  getAdminUserProfileByUid,
} from '@/server/admin/admin-users.service';
import { logAdminAction } from '@/server/admin/admin-logs.service';
import { ApiError } from '@/server/lib/errors';
import {
  addDays,
  countAnalyticsEventInRange,
  percentage,
  scanAnalyticsEventsByTypeInRange,
  startOfUtcDay,
  type DateRange,
} from '@/server/admin/dashboard/dashboard.repository.core';
import { countScopedSubmissionsInRange } from '@/server/admin/submissions/submissions.metrics.queries';
import {
  decodeModerationCursor,
  encodeModerationCursor,
} from '@/server/forms/shared/moderation.validation';
import { Timestamp } from 'firebase-admin/firestore';
import { startOfAdminMonth, startOfAdminYear } from '@/shared/time/europeKiev';
import { getSignedProjectAttachmentReadUrl } from '@/server/submissions/submissions.upload.service';
import {
  addSubmissionCommentRecord,
  getSubmissionById,
  softDeleteSubmissionRecord,
  updateSubmissionStatusRecord,
} from '@/server/submissions/submissions.repository';
import { isDeletedSubmissionDoc, toSubmissionListItemDto } from '@/server/submissions/submissions.mapper';
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
  EchocodeAppOverviewDto,
  EchocodeAppReferrerDto,
  EchocodeAppTopPageDto,
  EchocodeAppSubmissionsOverviewDto,
  EchocodeAppSubmissionsDto,
} from '@/server/admin/echocode-app/echocodeApp.types';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';

const SITE_ID = 'echocode_app' as const;
const SITE_HOST = 'echocode.app';
const MAX_LIST_ROWS = 8;
const FALLBACK_SCAN_PAGE_SIZE = 40;
const STATUS_ORDER: Record<SubmissionWorkflowStatus, number> = {
  new: 0,
  viewed: 1,
  processed: 2,
  rejected: 3,
  deferred: 4,
};

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Number(value.toFixed(2));
}

function toTrend(current: number, previous: number): TrendStats {
  const safeCurrent = sanitizeNumber(current);
  const safePrevious = sanitizeNumber(previous);

  if (safePrevious === 0 && safeCurrent === 0) {
    return { current: safeCurrent, previous: safePrevious, changePct: 0, direction: 'flat' };
  }

  if (safePrevious === 0) {
    return { current: safeCurrent, previous: safePrevious, changePct: 100, direction: 'up' };
  }

  const changePct = Number((((safeCurrent - safePrevious) / safePrevious) * 100).toFixed(2));
  let direction: TrendDirection = 'flat';
  if (changePct > 0) direction = 'up';
  if (changePct < 0) direction = 'down';

  return { current: safeCurrent, previous: safePrevious, changePct, direction };
}

function toMoMChange(current: number, previous: number): number | null {
  const safeCurrent = sanitizeNumber(current);
  const safePrevious = sanitizeNumber(previous);

  if (safePrevious === 0 && safeCurrent === 0) return 0;
  if (safePrevious === 0) return null;
  return Number((((safeCurrent - safePrevious) / safePrevious) * 100).toFixed(2));
}

function toKpi(
  value: number,
  wowCurrent: number,
  wowPrevious: number,
  momCurrent: number,
  momPrevious: number,
): DashboardKpiDto {
  return {
    value: sanitizeNumber(value),
    trend: toTrend(wowCurrent, wowPrevious),
    momChangePct: toMoMChange(momCurrent, momPrevious),
  };
}

function resolveRanges(period: DashboardPeriod): {
  current: DateRange;
  previous: DateRange;
  last7: DateRange;
  previous7: DateRange;
  last30: DateRange;
  previous30: DateRange;
} {
  const todayStart = startOfUtcDay(new Date());
  const tomorrow = addDays(todayStart, 1);

  const last7: DateRange = {
    start: addDays(tomorrow, -7),
    end: tomorrow,
  };
  const previous7: DateRange = {
    start: addDays(last7.start, -7),
    end: last7.start,
  };
  const last30: DateRange = {
    start: addDays(tomorrow, -30),
    end: tomorrow,
  };
  const previous30: DateRange = {
    start: addDays(last30.start, -30),
    end: last30.start,
  };

  if (period === 'week') {
    return {
      current: last7,
      previous: previous7,
      last7,
      previous7,
      last30,
      previous30,
    };
  }

  const rangeStart =
    period === 'month' ? startOfAdminMonth(todayStart) : startOfAdminYear(todayStart);
  const durationMs = tomorrow.getTime() - rangeStart.getTime();
  const current: DateRange = { start: rangeStart, end: tomorrow };
  const previous: DateRange = {
    start: new Date(rangeStart.getTime() - durationMs),
    end: rangeStart,
  };

  return {
    current,
    previous,
    last7,
    previous7,
    last30,
    previous30,
  };
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readMetadata(record: Record<string, unknown>): Record<string, unknown> | null {
  const value = record.metadata;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function toRankedRows<T extends { views: number }>(
  map: Map<string, number>,
  total: number,
  limit: number,
  buildRow: (label: string, views: number, sharePct: number) => T,
): T[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, views]) =>
      buildRow(label, views, total > 0 ? sanitizeNumber((views / total) * 100) : 0),
    );
}

function getReferrerLabel(metadata: Record<string, unknown> | null): string {
  if (!metadata) return 'Direct / unknown';

  const attribution = metadata.attribution;
  if (attribution && typeof attribution === 'object' && !Array.isArray(attribution)) {
    const source = readString(attribution as Record<string, unknown>, 'source');
    const medium = readString(attribution as Record<string, unknown>, 'medium');
    if (source && medium) return `${source} / ${medium}`;
    if (source) return source;
  }

  const rawReferrer = readString(metadata, 'referrer');
  if (!rawReferrer) return 'Direct / unknown';

  try {
    return new URL(rawReferrer).host;
  } catch {
    return rawReferrer;
  }
}

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

  baseQuery = baseQuery.orderBy('createdAt', 'desc').orderBy('__name__', 'desc');

  return baseQuery;
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
      throw ApiError.fromCode(
        'FIREBASE_UNAVAILABLE',
        'Failed to load echocode.app submissions',
        { cause },
      );
    }

    if (snapshot.empty) {
      exhausted = true;
      break;
    }

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (isDeletedSubmissionDoc(data)) return;
      if (
        query.status &&
        normalizeStoredSubmissionStatus(data.status) !== query.status
      ) {
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
        ? [{
            ...attachment,
            url: attachmentUrl,
          }]
        : [],
      comments: await attachAdminProfilesToComments(item.comments ?? []),
      reviewedByProfile: await getAdminUserProfileByUid(item.reviewedBy),
    },
  };
}

function assertSupportedStatus(
  status: string,
): asserts status is SubmissionWorkflowStatus {
  if (!(status in STATUS_ORDER)) {
    throw ApiError.fromCode('BAD_REQUEST', `Unsupported status: ${status}`);
  }
}

export async function getAdminEchocodeAppOverview(
  period: DashboardPeriod = 'week',
): Promise<EchocodeAppOverviewDto> {
  const ranges = resolveRanges(period);

  const [
    pageViewsCurrent,
    pageViewsPrevious,
    pageViewsLast30,
    pageViewsPrev30,
    submissionsCurrent,
    submissionsPrevious,
    submissionsLast30,
    submissionsPrev30,
  ] = await Promise.all([
    countAnalyticsEventInRange('page_view', ranges.current, { siteId: SITE_ID }),
    countAnalyticsEventInRange('page_view', ranges.previous, { siteId: SITE_ID }),
    countAnalyticsEventInRange('page_view', ranges.last30, { siteId: SITE_ID }),
    countAnalyticsEventInRange('page_view', ranges.previous30, { siteId: SITE_ID }),
    countScopedSubmissionsInRange(ranges.current, {
      siteId: SITE_ID,
      includeClientSubmissions: false,
    }),
    countScopedSubmissionsInRange(ranges.previous, {
      siteId: SITE_ID,
      includeClientSubmissions: false,
    }),
    countScopedSubmissionsInRange(ranges.last30, {
      siteId: SITE_ID,
      includeClientSubmissions: false,
    }),
    countScopedSubmissionsInRange(ranges.previous30, {
      siteId: SITE_ID,
      includeClientSubmissions: false,
    }),
  ]);

  const pageCounts = new Map<string, number>();
  const referrerCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();

  await scanAnalyticsEventsByTypeInRange(
    'page_view',
    ranges.current,
    (data) => {
      const metadata = readMetadata(data);
      const path = readString(metadata ?? {}, 'path') ?? '/';
      const referrer = getReferrerLabel(metadata);
      const country = readString(data, 'country')?.toUpperCase() ?? 'Unknown';

      pageCounts.set(path, (pageCounts.get(path) ?? 0) + 1);
      referrerCounts.set(referrer, (referrerCounts.get(referrer) ?? 0) + 1);
      countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
    },
    { siteId: SITE_ID },
  );

  const currentConversion = percentage(submissionsCurrent, pageViewsCurrent);
  const previousConversion = percentage(submissionsPrevious, pageViewsPrevious);
  const last30Conversion = percentage(submissionsLast30, pageViewsLast30);
  const prev30Conversion = percentage(submissionsPrev30, pageViewsPrev30);
  const currentCountries = countryCounts.size;

  const previousCountryCounts = new Map<string, number>();
  await scanAnalyticsEventsByTypeInRange(
    'page_view',
    ranges.previous,
    (data) => {
      const country = readString(data, 'country')?.toUpperCase() ?? 'Unknown';
      previousCountryCounts.set(country, (previousCountryCounts.get(country) ?? 0) + 1);
    },
    { siteId: SITE_ID },
  );

  const countries = toRankedRows(
    countryCounts,
    pageViewsCurrent,
    MAX_LIST_ROWS,
    (country, views, sharePct) => ({ country, views, sharePct }),
  );
  const topPages: EchocodeAppTopPageDto[] = toRankedRows(
    pageCounts,
    pageViewsCurrent,
    MAX_LIST_ROWS,
    (path, views, sharePct) => ({ path, views, sharePct }),
  );
  const referrers: EchocodeAppReferrerDto[] = toRankedRows(
    referrerCounts,
    pageViewsCurrent,
    MAX_LIST_ROWS,
    (label, views, sharePct) => ({ label, views, sharePct }),
  );

  return {
    period,
    siteId: SITE_ID,
    siteHost: SITE_HOST,
    kpis: {
      pageViews: toKpi(
        pageViewsCurrent,
        pageViewsCurrent,
        pageViewsPrevious,
        pageViewsLast30,
        pageViewsPrev30,
      ),
      submissions: toKpi(
        submissionsCurrent,
        submissionsCurrent,
        submissionsPrevious,
        submissionsLast30,
        submissionsPrev30,
      ),
      conversionRate: toKpi(
        currentConversion,
        currentConversion,
        previousConversion,
        last30Conversion,
        prev30Conversion,
      ),
      countries: toKpi(
        currentCountries,
        currentCountries,
        previousCountryCounts.size,
        currentCountries,
        previousCountryCounts.size,
      ),
    },
    geography: {
      totalPageViews: sanitizeNumber(pageViewsCurrent),
      countries,
    },
    topPages,
    referrers,
  };
}

export async function getAdminEchocodeAppSubmissionsOverview(): Promise<EchocodeAppSubmissionsOverviewDto> {
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

  return {
    totals: {
      currentMonth,
      allTime,
    },
    byStatus,
  };
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

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'submissions.soft_delete',
    entityType: 'submission',
    entityId: input.submissionId,
    metadata: {
      actorEmail: input.adminEmail,
      deletedAt: deleted.updatedAt,
      siteId: SITE_ID,
    },
  });

  return deleted;
}
