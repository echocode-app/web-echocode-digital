import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { isLocalhostAnalyticsEvent } from '@/server/analytics/analytics.localhost';
import { ApiError } from '@/server/lib/errors';
import {
  addAdminDays,
  getAdminDateIso,
  getAdminYearMonthRanges,
  startOfAdminDay,
} from '@/shared/time/europeKiev';
import type { SiteId } from '@/server/sites/siteContext';
import type {
  DashboardRawAggregates,
  TrafficVsLeadsPointDto,
} from '@/server/admin/dashboard/dashboard.types';

export type DateRange = {
  start: Date;
  end: Date;
};

const EVENT_PAGE_SIZE = 500;

export function startOfUtcDay(input: Date): Date {
  return startOfAdminDay(input);
}

export function addDays(input: Date, days: number): Date {
  return addAdminDays(input, days);
}

export function toIsoDate(input: Date): string {
  return getAdminDateIso(input);
}

export function getRangeFromDays(todayStart: Date, days: number, offsetDays = 0): DateRange {
  const end = addDays(todayStart, 1 - offsetDays);
  const start = addDays(end, -days);
  return { start, end };
}

export function getDayRanges(todayStart: Date, days: number): DateRange[] {
  const firstDay = addDays(todayStart, -(days - 1));
  return Array.from({ length: days }, (_, index) => {
    const dayStart = addDays(firstDay, index);
    return {
      start: dayStart,
      end: addDays(dayStart, 1),
    };
  });
}

export function getDayRangesFrom(startDate: Date, days: number): DateRange[] {
  return Array.from({ length: days }, (_, index) => {
    const dayStart = addDays(startDate, index);
    return {
      start: dayStart,
      end: addDays(dayStart, 1),
    };
  });
}

export function getCurrentYearMonthRanges(
  todayStart: Date,
): Array<{ month: string; range: DateRange }> {
  return getAdminYearMonthRanges(todayStart);
}

export function normalizeSafeNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  if (!Number.isSafeInteger(value)) return Math.trunc(value);
  return value;
}

export function normalizeSafeRate(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(2));
}

export function isUploadInitAnalyticsEvent(record: Record<string, unknown>): boolean {
  const metadata = record.metadata;
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return false;
  }

  return (metadata as Record<string, unknown>).stage === 'upload_init';
}

export function percentage(numerator: number, denominator: number): number {
  if (denominator <= 0 || numerator <= 0) return 0;
  return normalizeSafeRate((numerator / denominator) * 100);
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return normalizeSafeRate(((current - previous) / previous) * 100);
}

// Unified guarded count() accessor for all dashboard aggregates.
export async function readCount(
  query: FirebaseFirestore.Query,
  fallbackMessage: string,
): Promise<number> {
  try {
    const snapshot = await query.count().get();
    const count = snapshot.data().count;

    if (!Number.isSafeInteger(count) || count < 0) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Invalid Firestore count() value in dashboard');
    }

    return count;
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', fallbackMessage, { cause });
  }
}

// Narrow helper for eventType + timestamp range count queries.
export async function countAnalyticsEventInRange(
  eventType: string,
  range: DateRange,
  options: { siteId?: SiteId } = {},
): Promise<number> {
  if (
    eventType === 'page_view' ||
    eventType === 'submit_project' ||
    eventType === 'submit_vacancy' ||
    eventType === 'apply_vacancy'
  ) {
    let count = 0;

    await scanAnalyticsEventsByTypeInRange(
      eventType,
      range,
      (data) => {
        if (
          (eventType === 'submit_project' || eventType === 'submit_vacancy') &&
          isUploadInitAnalyticsEvent(data)
        ) {
          return;
        }
        count += 1;
      },
      options,
    );

    return normalizeSafeNumber(count);
  }

  const firestore = getFirestoreDb();

  let query: FirebaseFirestore.Query = firestore
    .collection('analytics_events')
    .where('eventType', '==', eventType)
    .where('timestamp', '>=', Timestamp.fromDate(range.start))
    .where('timestamp', '<', Timestamp.fromDate(range.end));

  if (options.siteId) {
    query = query.where('siteId', '==', options.siteId);
  }

  return readCount(query, `Failed to count analytics event (${eventType})`);
}

export async function countVacancyLeadsInRange(
  range: DateRange,
  options: { siteId?: SiteId } = {},
): Promise<number> {
  const [submitCount, applyCount] = await Promise.all([
    countAnalyticsEventInRange('submit_vacancy', range, options),
    countAnalyticsEventInRange('apply_vacancy', range, options),
  ]);

  return normalizeSafeNumber(submitCount + applyCount);
}

export async function getSubmissionsTrend(
  dayRanges: DateRange[],
  options: { siteId?: SiteId } = {},
): Promise<DashboardRawAggregates['charts']['submissionsTrend']> {
  const firestore = getFirestoreDb();

  const countPromises = dayRanges.map((range) => {
    let query: FirebaseFirestore.Query = firestore
      .collection('submissions')
      .where('createdAt', '>=', Timestamp.fromDate(range.start))
      .where('createdAt', '<', Timestamp.fromDate(range.end));

    if (options.siteId) {
      query = query.where('siteId', '==', options.siteId);
    }

    return readCount(query, 'Failed to count submissions trend');
  });

  const counts = await Promise.all(countPromises);

  return dayRanges.map((range, index) => ({
    date: toIsoDate(range.start),
    submissions: normalizeSafeNumber(counts[index] ?? 0),
  }));
}

export async function getTrafficAndLeadsSeries(
  dayRanges: DateRange[],
  options: { siteId?: SiteId } = {},
): Promise<TrafficVsLeadsPointDto[]> {
  const requests = dayRanges.map(async (range) => {
    const [pageViews, projectLeads, vacancyLeads] = await Promise.all([
      countAnalyticsEventInRange('page_view', range, options),
      countAnalyticsEventInRange('submit_project', range, options),
      countVacancyLeadsInRange(range, options),
    ]);

    return {
      date: toIsoDate(range.start),
      traffic: normalizeSafeNumber(pageViews),
      leads: normalizeSafeNumber(projectLeads + vacancyLeads),
    };
  });

  return Promise.all(requests);
}

export async function getProjectLeadsByDay(
  dayRanges: DateRange[],
  options: { siteId?: SiteId } = {},
): Promise<number[]> {
  const counts = await Promise.all(
    dayRanges.map((range) => countAnalyticsEventInRange('submit_project', range, options)),
  );
  return counts.map((count) => normalizeSafeNumber(count));
}

export async function getLeadDistributionYearMonthly(
  monthRanges: Array<{ month: string; range: DateRange }>,
  options: { siteId?: SiteId } = {},
): Promise<DashboardRawAggregates['charts']['leadDistributionYearMonthly']> {
  const rows = await Promise.all(
    monthRanges.map(async ({ month, range }) => {
      const [project, vacancy] = await Promise.all([
        countAnalyticsEventInRange('submit_project', range, options),
        countVacancyLeadsInRange(range, options),
      ]);

      return {
        month,
        project: normalizeSafeNumber(project),
        vacancy: normalizeSafeNumber(vacancy),
      };
    }),
  );

  return rows;
}

export async function scanAnalyticsEventsByTypeInRange(
  eventType: 'page_view' | 'submit_project' | 'submit_vacancy' | 'apply_vacancy',
  range: DateRange,
  onDoc: (data: Record<string, unknown>) => void,
  options: { siteId?: SiteId } = {},
): Promise<void> {
  const firestore = getFirestoreDb();
  const startTs = Timestamp.fromDate(range.start);
  const endTs = Timestamp.fromDate(range.end);
  let cursor: FirebaseFirestore.QueryDocumentSnapshot | null = null;

  while (true) {
    let query: FirebaseFirestore.Query = firestore
      .collection('analytics_events')
      .where('eventType', '==', eventType)
      .where('timestamp', '>=', startTs)
      .where('timestamp', '<', endTs)
      .orderBy('timestamp', 'desc')
      .limit(EVENT_PAGE_SIZE);

    if (options.siteId) {
      query = query.where('siteId', '==', options.siteId);
    }

    if (cursor) {
      query = query.startAfter(cursor);
    }

    let snapshot: FirebaseFirestore.QuerySnapshot;
    try {
      snapshot = await query.get();
    } catch (cause) {
      throw ApiError.fromCode(
        'FIREBASE_UNAVAILABLE',
        `Failed to load analytics events (${eventType})`,
        {
          cause,
        },
      );
    }

    if (snapshot.empty) break;

    snapshot.docs.forEach((doc) => {
      const data = doc.data() as Record<string, unknown>;
      if (isLocalhostAnalyticsEvent(data)) return;
      onDoc(data);
    });
    cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;

    if (snapshot.size < EVENT_PAGE_SIZE) break;
  }
}
