import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { isLocalhostAnalyticsEvent } from '@/server/analytics/analytics.localhost';
import { ApiError } from '@/server/lib/errors';
import type { TopVacancyPointDto } from '@/server/admin/dashboard/dashboard.types';
import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';
import {
  isUploadInitAnalyticsEvent,
  normalizeSafeNumber,
} from '@/server/admin/dashboard/dashboard.repository.core';
import {
  DashboardEntityEventDoc,
  extractVacancyKey,
  extractVacancyLabel,
  getVacancyTitleByIdOrSlug,
  TOP_VACANCIES_LIMIT,
  TOP_VACANCY_EVENTS_SCAN_LIMIT,
} from '@/server/admin/dashboard/dashboard.repository.entities.shared';

export async function getTopVacancies(last30DaysRange: DateRange): Promise<TopVacancyPointDto[]> {
  const firestore = getFirestoreDb();
  const startTs = Timestamp.fromDate(last30DaysRange.start);

  const queries = (['submit_vacancy', 'apply_vacancy'] as const).map((eventType) =>
    firestore
      .collection('analytics_events')
      .where('eventType', '==', eventType)
      .where('timestamp', '>=', startTs)
      .orderBy('timestamp', 'desc')
      .limit(TOP_VACANCY_EVENTS_SCAN_LIMIT)
      .get(),
  );

  let snapshots: FirebaseFirestore.QuerySnapshot[];

  try {
    snapshots = await Promise.all(queries);
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load vacancy application events', {
      cause,
    });
  }

  const bucket = new Map<string, { count: number; label: string | null }>();

  for (const snapshot of snapshots) {
    for (const doc of snapshot.docs) {
      const data = doc.data() as DashboardEntityEventDoc;
      if (isLocalhostAnalyticsEvent(data)) continue;
      if (isUploadInitAnalyticsEvent(data)) continue;
      const vacancyKey = extractVacancyKey(data.metadata);
      if (!vacancyKey) continue;

      const existing = bucket.get(vacancyKey);
      if (existing) {
        existing.count += 1;
        continue;
      }

      bucket.set(vacancyKey, {
        count: 1,
        label: extractVacancyLabel(data.metadata),
      });
    }
  }

  const ranked = Array.from(bucket.entries())
    .map(([vacancyId, value]) => ({
      vacancyId,
      applications: normalizeSafeNumber(value.count),
      label: value.label,
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, TOP_VACANCIES_LIMIT);

  const labels = await Promise.all(
    ranked.map(async (item) => item.label ?? (await getVacancyTitleByIdOrSlug(item.vacancyId))),
  );

  return ranked.map((item, index) => ({
    vacancyId: item.vacancyId,
    applications: item.applications,
    label: labels[index] ?? item.vacancyId,
  }));
}
