import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import { emptyModerationStatusCounts, toModerationStatus } from '@/server/forms/shared/moderation.repository';
import {
  EMAIL_SUBMISSIONS_COLLECTION,
  EMAIL_SUBMISSION_STATUS_ORDER,
  isEmailSubmissionSoftDeleted,
} from '@/server/forms/email-submission/emailSubmission.repository.shared';
import type { EmailSubmissionStatus, EmailSubmissionsOverviewDto } from '@/server/forms/email-submission/emailSubmission.types';

async function countEmailSubmissions(input?: {
  status?: EmailSubmissionStatus;
  range?: { start: Date; end: Date };
}): Promise<number> {
  const firestore = getFirestoreDb();
  let query: FirebaseFirestore.Query = firestore.collection(EMAIL_SUBMISSIONS_COLLECTION);

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
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to count email submissions', { cause });
  }

  return snapshot.docs.reduce((acc, doc) => {
    const data = doc.data();
    return isEmailSubmissionSoftDeleted(data) ? acc : acc + 1;
  }, 0);
}

async function buildStatusesByMonthFromYearScan(year: number): Promise<EmailSubmissionsOverviewDto['statusesByMonth']> {
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
      .collection(EMAIL_SUBMISSIONS_COLLECTION)
      .where('createdAt', '>=', Timestamp.fromDate(yearStart))
      .where('createdAt', '<', Timestamp.fromDate(yearEnd))
      .get();
  } catch {
    return Array.from(pointByMonth.values());
  }

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (isEmailSubmissionSoftDeleted(data)) return;

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
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const [currentMonth, allTime, statusCounts] = await Promise.all([
    countEmailSubmissions({ range: { start: monthStart, end: monthEnd } }),
    countEmailSubmissions(),
    Promise.all(EMAIL_SUBMISSION_STATUS_ORDER.map((status) => countEmailSubmissions({ status }))),
  ]);

  const byStatus = emptyModerationStatusCounts();
  // Keep ordering deterministic for UI status cards and chart legends.
  EMAIL_SUBMISSION_STATUS_ORDER.forEach((status, index) => {
    byStatus[status] = statusCounts[index] ?? 0;
  });

  const statusesByMonth = await buildStatusesByMonthFromYearScan(now.getUTCFullYear());

  return {
    totals: {
      currentMonth,
      allTime,
    },
    byStatus,
    statusesByMonth,
  };
}
