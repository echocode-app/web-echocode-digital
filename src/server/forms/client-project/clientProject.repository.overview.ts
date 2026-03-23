import { Timestamp } from 'firebase-admin/firestore';
import {
  normalizeSafeNumber,
  startOfUtcDay,
} from '@/server/admin/dashboard/dashboard.repository.core';
import { getFirestoreDb } from '@/server/firebase/firestore';
import {
  getOverviewStats,
  replaceOverviewStats,
} from '@/server/admin/submissions/overviewStats.repository';
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

async function listActiveClientSubmissionsInRange(input: {
  start: Date;
  end: Date;
}): Promise<FirebaseFirestore.QueryDocumentSnapshot[]> {
  const firestore = getFirestoreDb();

  let snapshot: FirebaseFirestore.QuerySnapshot;
  try {
    snapshot = await firestore
      .collection(CLIENT_SUBMISSIONS_COLLECTION)
      .where('createdAt', '>=', Timestamp.fromDate(input.start))
      .where('createdAt', '<', Timestamp.fromDate(input.end))
      .get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load client submissions overview', {
      cause,
    });
  }

  return snapshot.docs.filter((doc) => !isSoftDeleted(doc.data()));
}

async function listAllActiveClientSubmissions(): Promise<
  FirebaseFirestore.QueryDocumentSnapshot[]
> {
  const firestore = getFirestoreDb();

  let snapshot: FirebaseFirestore.QuerySnapshot;
  try {
    snapshot = await firestore.collection(CLIENT_SUBMISSIONS_COLLECTION).get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load client submissions overview', {
      cause,
    });
  }

  return snapshot.docs.filter((doc) => !isSoftDeleted(doc.data()));
}

function emptyStatusCounts(): ClientSubmissionStatusCountsDto {
  return { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS };
}

async function buildStatusesByMonthFromYearScan(
  year: number,
): Promise<ClientSubmissionsOverviewDto['statusesByMonth']> {
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year + 1, 0, 1));

  const pointByMonth = new Map<string, ClientSubmissionsOverviewDto['statusesByMonth'][number]>();

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

  let docs: FirebaseFirestore.QueryDocumentSnapshot[];
  try {
    docs = await listActiveClientSubmissionsInRange({
      start: yearStart,
      end: yearEnd,
    });
  } catch {
    return Array.from(pointByMonth.values());
  }

  docs.forEach((doc) => {
    const data = doc.data();
    const createdAt = data.createdAt;
    const status = typeof data.status === 'string' ? data.status : 'new';

    if (!(createdAt instanceof Timestamp)) return;
    if (!CLIENT_SUBMISSION_STATUS_ORDER.includes(status as ClientSubmissionStatus)) return;

    const month = String(createdAt.toDate().getUTCMonth() + 1).padStart(2, '0');
    const point = pointByMonth.get(month);
    if (!point) return;

    point[status as ClientSubmissionStatus] = normalizeSafeNumber(
      point[status as ClientSubmissionStatus] + 1,
    );
  });

  return Array.from(pointByMonth.values());
}

export async function getClientSubmissionsOverview(): Promise<ClientSubmissionsOverviewDto> {
  const cachedStats = await getOverviewStats('client_submissions');
  if (cachedStats) {
    return cachedStats;
  }

  const todayStart = startOfUtcDay(new Date());
  const yearStart = new Date(Date.UTC(todayStart.getUTCFullYear(), 0, 1));
  const yearEnd = new Date(Date.UTC(todayStart.getUTCFullYear() + 1, 0, 1));
  const monthStart = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), 1));
  const monthEnd = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth() + 1, 1));

  const [docsAllTime, docsInYear] = await Promise.all([
    listAllActiveClientSubmissions(),
    listActiveClientSubmissionsInRange({
      start: yearStart,
      end: yearEnd,
    }),
  ]);

  const byStatus = emptyStatusCounts();

  docsAllTime.forEach((doc) => {
    const data = doc.data();
    const status = typeof data.status === 'string' ? data.status : 'new';

    if (!CLIENT_SUBMISSION_STATUS_ORDER.includes(status as ClientSubmissionStatus)) return;

    byStatus[status as ClientSubmissionStatus] = normalizeSafeNumber(
      byStatus[status as ClientSubmissionStatus] + 1,
    );
  });

  const currentMonth = docsInYear.reduce((count, doc) => {
    const createdAt = doc.data().createdAt;
    if (!(createdAt instanceof Timestamp)) return count;

    const createdDate = createdAt.toDate();
    return createdDate >= monthStart && createdDate < monthEnd ? count + 1 : count;
  }, 0);

  const statusesByMonth = await buildStatusesByMonthFromYearScan(todayStart.getUTCFullYear());

  const overview = {
    totals: {
      currentMonth: normalizeSafeNumber(currentMonth),
      allTime: normalizeSafeNumber(docsAllTime.length),
    },
    byStatus,
    statusesByMonth,
  };

  await replaceOverviewStats('client_submissions', overview);

  return overview;
}

export function assertUpdatedAtTimestamp(
  value: unknown,
  label: string,
): asserts value is Timestamp {
  assertTimestamp(value, label);
}
