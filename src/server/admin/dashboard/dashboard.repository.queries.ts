import { Timestamp } from 'firebase-admin/firestore';
import type { DashboardRepositoryRanges } from '@/server/admin/dashboard/dashboard.repository.ranges';
import { readCount, type DateRange } from '@/server/admin/dashboard/dashboard.repository.core';

type AdminActionType = 'vacancies.manage' | 'portfolio.manage';

type DashboardCountQueries = {
  submissionsTotalQuery: FirebaseFirestore.Query;
  clientSubmissionsTotalQuery: FirebaseFirestore.Query;
  activeVacanciesQuery: FirebaseFirestore.Query;
  portfolioTotalQuery: FirebaseFirestore.Query;
  submissionsLast7Query: FirebaseFirestore.Query;
  clientSubmissionsLast7Query: FirebaseFirestore.Query;
  submissionsPrev7Query: FirebaseFirestore.Query;
  clientSubmissionsPrev7Query: FirebaseFirestore.Query;
  submissionsLast30Query: FirebaseFirestore.Query;
  clientSubmissionsLast30Query: FirebaseFirestore.Query;
  submissionsPrev30Query: FirebaseFirestore.Query;
  clientSubmissionsPrev30Query: FirebaseFirestore.Query;
  vacanciesLast7Query: FirebaseFirestore.Query;
  vacanciesPrev7Query: FirebaseFirestore.Query;
  vacanciesLast30Query: FirebaseFirestore.Query;
  vacanciesPrev30Query: FirebaseFirestore.Query;
  portfolioLast7Query: FirebaseFirestore.Query;
  portfolioPrev7Query: FirebaseFirestore.Query;
  portfolioLast30Query: FirebaseFirestore.Query;
  portfolioPrev30Query: FirebaseFirestore.Query;
};

export async function countAdminActionsInRange(
  firestore: FirebaseFirestore.Firestore,
  actionType: AdminActionType,
  range: DateRange,
): Promise<number> {
  const query = firestore
    .collection('admin_logs')
    .where('actionType', '==', actionType)
    .where('timestamp', '>=', Timestamp.fromDate(range.start))
    .where('timestamp', '<', Timestamp.fromDate(range.end));

  return readCount(query, `Failed to count admin logs for ${actionType}`);
}

export function buildDashboardCountQueries(
  firestore: FirebaseFirestore.Firestore,
  ranges: DashboardRepositoryRanges,
): DashboardCountQueries {
  return {
    submissionsTotalQuery: firestore.collection('submissions'),
    clientSubmissionsTotalQuery: firestore.collection('client_submissions'),
    activeVacanciesQuery: firestore.collection('vacancies').where('isPublished', '==', true),
    portfolioTotalQuery: firestore.collection('portfolio'),
    submissionsLast7Query: firestore
      .collection('submissions')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.last7Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.last7Days.end)),
    clientSubmissionsLast7Query: firestore
      .collection('client_submissions')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.last7Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.last7Days.end)),
    submissionsPrev7Query: firestore
      .collection('submissions')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.previous7Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.previous7Days.end)),
    clientSubmissionsPrev7Query: firestore
      .collection('client_submissions')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.previous7Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.previous7Days.end)),
    submissionsLast30Query: firestore
      .collection('submissions')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.last30Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.last30Days.end)),
    clientSubmissionsLast30Query: firestore
      .collection('client_submissions')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.last30Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.last30Days.end)),
    submissionsPrev30Query: firestore
      .collection('submissions')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.previous30Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.previous30Days.end)),
    clientSubmissionsPrev30Query: firestore
      .collection('client_submissions')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.previous30Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.previous30Days.end)),
    vacanciesLast7Query: firestore
      .collection('vacancies')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.last7Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.last7Days.end))
      .where('isPublished', '==', true),
    vacanciesPrev7Query: firestore
      .collection('vacancies')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.previous7Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.previous7Days.end))
      .where('isPublished', '==', true),
    vacanciesLast30Query: firestore
      .collection('vacancies')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.last30Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.last30Days.end))
      .where('isPublished', '==', true),
    vacanciesPrev30Query: firestore
      .collection('vacancies')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.previous30Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.previous30Days.end))
      .where('isPublished', '==', true),
    portfolioLast7Query: firestore
      .collection('portfolio')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.last7Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.last7Days.end)),
    portfolioPrev7Query: firestore
      .collection('portfolio')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.previous7Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.previous7Days.end)),
    portfolioLast30Query: firestore
      .collection('portfolio')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.last30Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.last30Days.end)),
    portfolioPrev30Query: firestore
      .collection('portfolio')
      .where('createdAt', '>=', Timestamp.fromDate(ranges.previous30Days.start))
      .where('createdAt', '<', Timestamp.fromDate(ranges.previous30Days.end)),
  };
}
