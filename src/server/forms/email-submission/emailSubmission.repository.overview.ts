import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import {
  getOverviewStats,
  replaceOverviewStats,
} from '@/server/admin/submissions/overviewStats.repository';
import { ApiError } from '@/server/lib/errors';
import {
  emptyModerationStatusCounts,
  toModerationStatus,
} from '@/server/forms/shared/moderation.repository';
import {
  EMAIL_SUBMISSIONS_COLLECTION,
  isEmailSubmissionSoftDeleted,
} from '@/server/forms/email-submission/emailSubmission.repository.shared';
import type { EmailSubmissionsOverviewDto } from '@/server/forms/email-submission/emailSubmission.types';

async function listActiveEmailSubmissionsInRange(input: {
  start: Date;
  end: Date;
}): Promise<FirebaseFirestore.QueryDocumentSnapshot[]> {
  const firestore = getFirestoreDb();

  let snapshot: FirebaseFirestore.QuerySnapshot;
  try {
    snapshot = await firestore
      .collection(EMAIL_SUBMISSIONS_COLLECTION)
      .where('createdAt', '>=', Timestamp.fromDate(input.start))
      .where('createdAt', '<', Timestamp.fromDate(input.end))
      .get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load email submissions overview', {
      cause,
    });
  }

  return snapshot.docs.filter((doc) => !isEmailSubmissionSoftDeleted(doc.data()));
}

async function listAllActiveEmailSubmissions(): Promise<FirebaseFirestore.QueryDocumentSnapshot[]> {
  const firestore = getFirestoreDb();

  let snapshot: FirebaseFirestore.QuerySnapshot;
  try {
    snapshot = await firestore.collection(EMAIL_SUBMISSIONS_COLLECTION).get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load email submissions overview', {
      cause,
    });
  }

  return snapshot.docs.filter((doc) => !isEmailSubmissionSoftDeleted(doc.data()));
}

async function buildStatusesByMonthFromYearScan(
  year: number,
): Promise<EmailSubmissionsOverviewDto['statusesByMonth']> {
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year + 1, 0, 1));

  const pointByMonth = new Map<string, EmailSubmissionsOverviewDto['statusesByMonth'][number]>();

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
    docs = await listActiveEmailSubmissionsInRange({
      start: yearStart,
      end: yearEnd,
    });
  } catch {
    return Array.from(pointByMonth.values());
  }

  docs.forEach((doc) => {
    const data = doc.data();
    const createdAt = data.createdAt;
    const status = toModerationStatus(data.status);

    if (!(createdAt instanceof Timestamp)) return;

    const month = String(createdAt.toDate().getUTCMonth() + 1).padStart(2, '0');
    const point = pointByMonth.get(month);
    if (!point) return;

    point[status] += 1;
  });

  return Array.from(pointByMonth.values());
}

export async function getEmailSubmissionsOverview(): Promise<EmailSubmissionsOverviewDto> {
  const cachedStats = await getOverviewStats('email_submissions');
  if (cachedStats) {
    return cachedStats;
  }

  const now = new Date();
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const yearEnd = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const [docsAllTime, docsInYear] = await Promise.all([
    listAllActiveEmailSubmissions(),
    listActiveEmailSubmissionsInRange({
      start: yearStart,
      end: yearEnd,
    }),
  ]);

  const byStatus = emptyModerationStatusCounts();

  docsAllTime.forEach((doc) => {
    const status = toModerationStatus(doc.data().status);
    byStatus[status] += 1;
  });

  const currentMonth = docsInYear.reduce((count, doc) => {
    const createdAt = doc.data().createdAt;
    if (!(createdAt instanceof Timestamp)) return count;

    const createdDate = createdAt.toDate();
    return createdDate >= monthStart && createdDate < monthEnd ? count + 1 : count;
  }, 0);

  const statusesByMonth = await buildStatusesByMonthFromYearScan(now.getUTCFullYear());

  const overview = {
    totals: {
      currentMonth,
      allTime: docsAllTime.length,
    },
    byStatus,
    statusesByMonth,
  };

  await replaceOverviewStats('email_submissions', overview);

  return overview;
}
