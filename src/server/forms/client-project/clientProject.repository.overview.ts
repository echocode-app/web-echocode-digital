import { Timestamp } from 'firebase-admin/firestore';
import {
  getCurrentYearMonthRanges,
  normalizeSafeNumber,
  startOfUtcDay,
} from '@/server/admin/dashboard/dashboard.repository.core';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import type {
  ClientSubmissionStatus,
  ClientSubmissionStatusCountsDto,
  ClientSubmissionsOverviewDto,
} from '@/server/forms/client-project/clientProject.types';
import {
  assertTimestamp,
  CLIENT_SUBMISSIONS_COLLECTION,
  CLIENT_SUBMISSION_STATUS_ORDER,
} from '@/server/forms/client-project/clientProject.repository.shared';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';

function isSoftDeleted(data: Record<string, unknown>): boolean {
  return data.isDeleted === true;
}

async function countClientSubmissions(input?: {
  status?: ClientSubmissionStatus;
  range?: { start: Date; end: Date };
}): Promise<number> {
  const firestore = getFirestoreDb();
  let query: FirebaseFirestore.Query = firestore.collection(CLIENT_SUBMISSIONS_COLLECTION);

  if (input?.status) {
    query = query.where('status', '==', input.status);
  }

  if (input?.range) {
    query = query
      .where('createdAt', '>=', Timestamp.fromDate(input.range.start))
      .where('createdAt', '<', Timestamp.fromDate(input.range.end));
  }

  let snapshot: FirebaseFirestore.QuerySnapshot;
  try {
    snapshot = await query.get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to count client submissions', {
      cause,
    });
  }

  return snapshot.docs.reduce((count, doc) => {
    return isSoftDeleted(doc.data()) ? count : count + 1;
  }, 0);
}

function emptyStatusCounts(): ClientSubmissionStatusCountsDto {
  return { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS };
}

async function buildStatusesByMonthFromYearScan(year: number): Promise<ClientSubmissionsOverviewDto['statusesByMonth']> {
  const firestore = getFirestoreDb();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year + 1, 0, 1));

  const pointByMonth = new Map<string, {
    month: string;
    new: number;
    viewed: number;
    processed: number;
    rejected: number;
    deferred: number;
  }>();

  Array.from({ length: 12 }, (_, monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, '0');
    pointByMonth.set(month, {
      month,
      new: 0,
      viewed: 0,
      processed: 0,
      rejected: 0,
      deferred: 0,
    });
  });

  let snapshot: FirebaseFirestore.QuerySnapshot;
  try {
    snapshot = await firestore
      .collection(CLIENT_SUBMISSIONS_COLLECTION)
      .where('createdAt', '>=', Timestamp.fromDate(yearStart))
      .where('createdAt', '<', Timestamp.fromDate(yearEnd))
      .get();
  } catch {
    return Array.from(pointByMonth.values());
  }

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (isSoftDeleted(data)) return;
    const createdAt = data.createdAt;
    const status = typeof data.status === 'string' ? data.status : 'new';
    if (!(createdAt instanceof Timestamp)) return;
    if (!CLIENT_SUBMISSION_STATUS_ORDER.includes(status as ClientSubmissionStatus)) return;

    const month = String(createdAt.toDate().getUTCMonth() + 1).padStart(2, '0');
    const point = pointByMonth.get(month);
    if (!point) return;

    point[status as ClientSubmissionStatus] = normalizeSafeNumber(point[status as ClientSubmissionStatus] + 1);
  });

  return Array.from(pointByMonth.values());
}

export async function getClientSubmissionsOverview(): Promise<ClientSubmissionsOverviewDto> {
  const todayStart = startOfUtcDay(new Date());
  const monthStart = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), 1));
  const monthEnd = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth() + 1, 1));
  const yearMonths = getCurrentYearMonthRanges(todayStart);

  const [currentMonth, allTime, statusCounts] = await Promise.all([
    countClientSubmissions({ range: { start: monthStart, end: monthEnd } }),
    countClientSubmissions(),
    Promise.all(CLIENT_SUBMISSION_STATUS_ORDER.map((status) => countClientSubmissions({ status }))),
  ]);

  const byStatus = emptyStatusCounts();
  CLIENT_SUBMISSION_STATUS_ORDER.forEach((status, index) => {
    byStatus[status] = normalizeSafeNumber(statusCounts[index] ?? 0);
  });

  let statusesByMonth: ClientSubmissionsOverviewDto['statusesByMonth'];
  try {
    statusesByMonth = await Promise.all(
      yearMonths.map(async ({ month, range }) => {
        const monthStatusCounts = await Promise.all(
          CLIENT_SUBMISSION_STATUS_ORDER.map((status) => countClientSubmissions({ status, range })),
        );

        const point = {
          month,
          new: 0,
          viewed: 0,
          processed: 0,
          rejected: 0,
          deferred: 0,
        };

        CLIENT_SUBMISSION_STATUS_ORDER.forEach((status, statusIndex) => {
          point[status] = normalizeSafeNumber(monthStatusCounts[statusIndex] ?? 0);
        });

        return point;
      }),
    );
  } catch {
    statusesByMonth = await buildStatusesByMonthFromYearScan(todayStart.getUTCFullYear());
  }

  return {
    totals: {
      currentMonth: normalizeSafeNumber(currentMonth),
      allTime: normalizeSafeNumber(allTime),
    },
    byStatus,
    statusesByMonth,
  };
}

export function assertUpdatedAtTimestamp(value: unknown, label: string): asserts value is Timestamp {
  assertTimestamp(value, label);
}
