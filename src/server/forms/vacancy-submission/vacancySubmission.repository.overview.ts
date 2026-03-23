import { Timestamp } from 'firebase-admin/firestore';
import {
  getOverviewStats,
  replaceOverviewStats,
} from '@/server/admin/submissions/overviewStats.repository';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import {
  emptyModerationStatusCounts,
  isSoftDeleted,
  toModerationStatus,
} from '@/server/forms/shared/moderation.repository';
import {
  mapVacancySnapshot,
  toVacancyKey,
  VACANCY_SUBMISSIONS_COLLECTION,
} from '@/server/forms/vacancy-submission/vacancySubmission.repository.shared';
import type {
  VacancySubmissionVacancyGroupDto,
  VacancySubmissionsOverviewDto,
} from '@/server/forms/vacancy-submission/vacancySubmission.types';

async function listAllActiveVacancySubmissionsInYear(
  year: number,
): Promise<FirebaseFirestore.QueryDocumentSnapshot[]> {
  const firestore = getFirestoreDb();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year + 1, 0, 1));

  let snapshot: FirebaseFirestore.QuerySnapshot;
  try {
    snapshot = await firestore
      .collection(VACANCY_SUBMISSIONS_COLLECTION)
      .where('createdAt', '>=', Timestamp.fromDate(yearStart))
      .where('createdAt', '<', Timestamp.fromDate(yearEnd))
      .get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load vacancy submissions overview', {
      cause,
    });
  }

  return snapshot.docs.filter((doc) => !isSoftDeleted(doc.data()));
}

async function listAllActiveVacancySubmissions(): Promise<
  FirebaseFirestore.QueryDocumentSnapshot[]
> {
  const firestore = getFirestoreDb();

  try {
    const snapshot = await firestore.collection(VACANCY_SUBMISSIONS_COLLECTION).get();
    return snapshot.docs.filter((doc) => !isSoftDeleted(doc.data()));
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load vacancy submissions overview', {
      cause,
    });
  }
}

function buildVacancyGroups(
  docs: FirebaseFirestore.QueryDocumentSnapshot[],
): VacancySubmissionVacancyGroupDto[] {
  const groups = new Map<string, VacancySubmissionVacancyGroupDto>();

  docs.forEach((doc) => {
    const data = doc.data();
    const vacancy = mapVacancySnapshot(data);
    const key = typeof data.vacancyKey === 'string' ? data.vacancyKey : toVacancyKey(vacancy);
    const status = toModerationStatus(data.status);
    const createdAt =
      data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null;

    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, {
        vacancyKey: key,
        vacancy,
        submissionsTotal: 1,
        newCount: status === 'new' ? 1 : 0,
        latestSubmissionAt: createdAt,
      });
      return;
    }

    existing.submissionsTotal += 1;
    if (status === 'new') {
      existing.newCount += 1;
    }

    if (createdAt && (!existing.latestSubmissionAt || createdAt > existing.latestSubmissionAt)) {
      existing.latestSubmissionAt = createdAt;
    }
  });

  return Array.from(groups.values()).sort((a, b) => {
    if (b.newCount !== a.newCount) return b.newCount - a.newCount;
    if (b.submissionsTotal !== a.submissionsTotal) return b.submissionsTotal - a.submissionsTotal;
    return (b.latestSubmissionAt ?? '').localeCompare(a.latestSubmissionAt ?? '');
  });
}

export async function getVacancySubmissionsOverview(): Promise<VacancySubmissionsOverviewDto> {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const cachedStats = await getOverviewStats('vacancy_submissions');

  const docsAllTime = await listAllActiveVacancySubmissions();
  let stats = cachedStats;

  if (!stats) {
    const docsInYear = await listAllActiveVacancySubmissionsInYear(now.getUTCFullYear());
    const byStatus = emptyModerationStatusCounts();

    const statusesByMonthMap = new Map<
      string,
      {
        month: string;
        new: number;
        viewed: number;
        processed: number;
        rejected: number;
        deferred: number;
      }
    >();

    Array.from({ length: 12 }, (_, monthIndex) => {
      const month = String(monthIndex + 1).padStart(2, '0');
      statusesByMonthMap.set(month, {
        month,
        new: 0,
        viewed: 0,
        processed: 0,
        rejected: 0,
        deferred: 0,
      });
    });

    let currentMonth = 0;
    docsAllTime.forEach((doc) => {
      const data = doc.data();
      const status = toModerationStatus(data.status);

      byStatus[status] += 1;
    });

    docsInYear.forEach((doc) => {
      const data = doc.data();
      const status = toModerationStatus(data.status);
      const createdAt = data.createdAt;

      if (!(createdAt instanceof Timestamp)) return;

      const createdDate = createdAt.toDate();
      if (createdDate >= monthStart && createdDate < monthEnd) {
        currentMonth += 1;
      }

      const month = String(createdDate.getUTCMonth() + 1).padStart(2, '0');
      const point = statusesByMonthMap.get(month);
      if (!point) return;
      point[status] += 1;
    });

    stats = {
      totals: {
        currentMonth,
        allTime: docsAllTime.length,
      },
      byStatus,
      statusesByMonth: Array.from(statusesByMonthMap.values()),
    };

    await replaceOverviewStats('vacancy_submissions', stats).catch(() => undefined);
  }

  return {
    totals: stats.totals,
    byStatus: stats.byStatus,
    statusesByMonth: stats.statusesByMonth,
    byVacancy: buildVacancyGroups(docsAllTime),
  };
}
