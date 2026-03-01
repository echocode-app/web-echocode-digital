import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import type {
  DashboardRawAggregates,
  TrafficVsLeadsPointDto,
} from '@/server/admin/dashboard/dashboard.types';

export type DateRange = {
  start: Date;
  end: Date;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const EVENT_PAGE_SIZE = 500;

export function startOfUtcDay(input: Date): Date {
  return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
}

export function addDays(input: Date, days: number): Date {
  return new Date(input.getTime() + days * DAY_IN_MS);
}

export function toIsoDate(input: Date): string {
  return input.toISOString().slice(0, 10);
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

export function getCurrentYearMonthRanges(todayStart: Date): Array<{ month: string; range: DateRange }> {
  const year = todayStart.getUTCFullYear();

  return Array.from({ length: 12 }, (_, monthIndex) => {
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = monthIndex === 11
      ? new Date(Date.UTC(year + 1, 0, 1))
      : new Date(Date.UTC(year, monthIndex + 1, 1));

    return {
      month: String(monthIndex + 1).padStart(2, '0'),
      range: { start, end },
    };
  });
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
export async function readCount(query: FirebaseFirestore.Query, fallbackMessage: string): Promise<number> {
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
export async function countAnalyticsEventInRange(eventType: string, range: DateRange): Promise<number> {
  const firestore = getFirestoreDb();

  const query = firestore
    .collection('analytics_events')
    .where('eventType', '==', eventType)
    .where('timestamp', '>=', Timestamp.fromDate(range.start))
    .where('timestamp', '<', Timestamp.fromDate(range.end));

  return readCount(query, `Failed to count analytics event (${eventType})`);
}

export async function countVacancyLeadsInRange(range: DateRange): Promise<number> {
  const [submitCount, applyCount] = await Promise.all([
    countAnalyticsEventInRange('submit_vacancy', range),
    countAnalyticsEventInRange('apply_vacancy', range),
  ]);

  return normalizeSafeNumber(submitCount + applyCount);
}

export async function getSubmissionsTrend(dayRanges: DateRange[]): Promise<DashboardRawAggregates['charts']['submissionsTrend']> {
  const firestore = getFirestoreDb();

  const countPromises = dayRanges.map((range) => {
    const query = firestore
      .collection('submissions')
      .where('createdAt', '>=', Timestamp.fromDate(range.start))
      .where('createdAt', '<', Timestamp.fromDate(range.end));

    return readCount(query, 'Failed to count submissions trend');
  });

  const counts = await Promise.all(countPromises);

  return dayRanges.map((range, index) => ({
    date: toIsoDate(range.start),
    submissions: normalizeSafeNumber(counts[index] ?? 0),
  }));
}

export async function getTrafficAndLeadsSeries(dayRanges: DateRange[]): Promise<TrafficVsLeadsPointDto[]> {
  const requests = dayRanges.map(async (range) => {
    const [pageViews, projectLeads, vacancyLeads] = await Promise.all([
      countAnalyticsEventInRange('page_view', range),
      countAnalyticsEventInRange('submit_project', range),
      countVacancyLeadsInRange(range),
    ]);

    return {
      date: toIsoDate(range.start),
      traffic: normalizeSafeNumber(pageViews),
      leads: normalizeSafeNumber(projectLeads + vacancyLeads),
    };
  });

  return Promise.all(requests);
}

export async function getProjectLeadsByDay(dayRanges: DateRange[]): Promise<number[]> {
  const counts = await Promise.all(dayRanges.map((range) => countAnalyticsEventInRange('submit_project', range)));
  return counts.map((count) => normalizeSafeNumber(count));
}

export async function getLeadDistributionYearMonthly(
  monthRanges: Array<{ month: string; range: DateRange }>,
): Promise<DashboardRawAggregates['charts']['leadDistributionYearMonthly']> {
  const rows = await Promise.all(
    monthRanges.map(async ({ month, range }) => {
      const [project, vacancy] = await Promise.all([
        countAnalyticsEventInRange('submit_project', range),
        countVacancyLeadsInRange(range),
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
): Promise<void> {
  const firestore = getFirestoreDb();
  const startTs = Timestamp.fromDate(range.start);
  const endTs = Timestamp.fromDate(range.end);
  let cursor: FirebaseFirestore.QueryDocumentSnapshot | null = null;

  while (true) {
    let query = firestore
      .collection('analytics_events')
      .where('eventType', '==', eventType)
      .where('timestamp', '>=', startTs)
      .where('timestamp', '<', endTs)
      .orderBy('timestamp', 'desc')
      .limit(EVENT_PAGE_SIZE);

    if (cursor) {
      query = query.startAfter(cursor);
    }

    let snapshot: FirebaseFirestore.QuerySnapshot;
    try {
      snapshot = await query.get();
    } catch (cause) {
      throw ApiError.fromCode('FIREBASE_UNAVAILABLE', `Failed to load analytics events (${eventType})`, {
        cause,
      });
    }

    if (snapshot.empty) break;

    snapshot.docs.forEach((doc) => onDoc(doc.data() as Record<string, unknown>));
    cursor = snapshot.docs[snapshot.docs.length - 1] ?? null;

    if (snapshot.size < EVENT_PAGE_SIZE) break;
  }
}
