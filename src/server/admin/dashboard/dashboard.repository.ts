import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import type {
  AlertDto,
  DashboardRawAggregates,
  FunnelDto,
  LeadDistributionDto,
  SourcePerformanceDto,
  TopVacancyPointDto,
  TrafficVsLeadsPointDto,
} from '@/server/admin/dashboard/dashboard.types';

type DateRange = {
  start: Date;
  end: Date;
};

type EventDoc = {
  metadata?: unknown;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const TOP_VACANCIES_LIMIT = 6;
const TOP_VACANCY_EVENTS_SCAN_LIMIT = 3000;
const EVENT_PAGE_SIZE = 500;

function startOfUtcDay(input: Date): Date {
  return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
}

function addDays(input: Date, days: number): Date {
  return new Date(input.getTime() + days * DAY_IN_MS);
}

function toIsoDate(input: Date): string {
  return input.toISOString().slice(0, 10);
}

function normalizeSourceValue(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return normalized.slice(0, 64);
}

function getRangeFromDays(todayStart: Date, days: number, offsetDays = 0): DateRange {
  const end = addDays(todayStart, 1 - offsetDays);
  const start = addDays(end, -days);
  return { start, end };
}

function getDayRanges(todayStart: Date, days: number): DateRange[] {
  const firstDay = addDays(todayStart, -(days - 1));
  return Array.from({ length: days }, (_, index) => {
    const dayStart = addDays(firstDay, index);
    return {
      start: dayStart,
      end: addDays(dayStart, 1),
    };
  });
}

function getCurrentYearMonthRanges(todayStart: Date): Array<{ month: string; range: DateRange }> {
  const year = todayStart.getUTCFullYear();
  const currentMonth = todayStart.getUTCMonth();

  return Array.from({ length: currentMonth + 1 }, (_, monthIndex) => {
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = monthIndex === currentMonth
      ? addDays(todayStart, 1)
      : new Date(Date.UTC(year, monthIndex + 1, 1));

    return {
      month: String(monthIndex + 1).padStart(2, '0'),
      range: { start, end },
    };
  });
}

function normalizeSafeNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  if (!Number.isSafeInteger(value)) return Math.trunc(value);
  return value;
}

function normalizeSafeRate(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(2));
}

function percentage(numerator: number, denominator: number): number {
  if (denominator <= 0 || numerator <= 0) return 0;
  return normalizeSafeRate((numerator / denominator) * 100);
}

function pctChange(current: number, previous: number): number {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return normalizeSafeRate(((current - previous) / previous) * 100);
}

// Unified guarded count() accessor for all dashboard aggregates.
async function readCount(query: FirebaseFirestore.Query, fallbackMessage: string): Promise<number> {
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

// Extracts vacancy identity from known analytics metadata variants.
function extractVacancyKey(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;

  const map = metadata as Record<string, unknown>;
  const candidates = [
    map.vacancyId,
    map.vacancySlug,
    map.vacancy,
    map.jobId,
    map.jobSlug,
    map.slug,
    map.positionId,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

// Resolves optional display label from metadata when available.
function extractVacancyLabel(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const map = metadata as Record<string, unknown>;
  const candidates = [map.vacancyTitle, map.jobTitle, map.title, map.position];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

// Falls back to vacancies collection to make top-vacancy labels stable.
async function getVacancyTitleByIdOrSlug(key: string): Promise<string | null> {
  const firestore = getFirestoreDb();

  try {
    const byId = await firestore.collection('vacancies').doc(key).get();
    if (byId.exists) {
      const title = byId.data()?.title;
      return typeof title === 'string' && title.trim().length > 0 ? title.trim() : key;
    }

    const bySlug = await firestore.collection('vacancies').where('slug', '==', key).limit(1).get();
    const first = bySlug.docs[0];
    if (!first) return null;

    const title = first.data().title;
    return typeof title === 'string' && title.trim().length > 0 ? title.trim() : key;
  } catch {
    return null;
  }
}

// Narrow helper for eventType + timestamp range count queries.
async function countAnalyticsEventInRange(eventType: string, range: DateRange): Promise<number> {
  const firestore = getFirestoreDb();

  const query = firestore
    .collection('analytics_events')
    .where('eventType', '==', eventType)
    .where('timestamp', '>=', Timestamp.fromDate(range.start))
    .where('timestamp', '<', Timestamp.fromDate(range.end));

  return readCount(query, `Failed to count analytics event (${eventType})`);
}

async function countVacancyLeadsInRange(range: DateRange): Promise<number> {
  const [submitCount, applyCount] = await Promise.all([
    countAnalyticsEventInRange('submit_vacancy', range),
    countAnalyticsEventInRange('apply_vacancy', range),
  ]);

  return normalizeSafeNumber(submitCount + applyCount);
}

async function getSubmissionsTrend(dayRanges: DateRange[]): Promise<DashboardRawAggregates['charts']['submissionsTrend']> {
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

async function getTrafficAndLeadsSeries(dayRanges: DateRange[]): Promise<TrafficVsLeadsPointDto[]> {
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

async function getProjectLeadsByDay(dayRanges: DateRange[]): Promise<number[]> {
  const counts = await Promise.all(dayRanges.map((range) => countAnalyticsEventInRange('submit_project', range)));
  return counts.map((count) => normalizeSafeNumber(count));
}

async function getLeadDistributionYearMonthly(
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

async function scanAnalyticsEventsByTypeInRange(
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

async function getTopVacancies(last30DaysRange: DateRange): Promise<TopVacancyPointDto[]> {
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
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load vacancy application events', { cause });
  }

  const bucket = new Map<string, { count: number; label: string | null }>();

  for (const snapshot of snapshots) {
    for (const doc of snapshot.docs) {
      const data = doc.data() as EventDoc;
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

// Uses admin logs as secondary activity signal for entity management velocity.
async function countAdminActionsInRange(
  actionType: 'vacancies.manage' | 'portfolio.manage',
  range: DateRange,
): Promise<number> {
  const firestore = getFirestoreDb();
  const query = firestore
    .collection('admin_logs')
    .where('actionType', '==', actionType)
    .where('timestamp', '>=', Timestamp.fromDate(range.start))
    .where('timestamp', '<', Timestamp.fromDate(range.end));

  return readCount(query, `Failed to count admin logs for ${actionType}`);
}

function sortTopSources(
  sourceStats: Map<string, { pageViews: number; projectLeads: number; vacancyLeads: number }>,
): SourcePerformanceDto[] {
  return Array.from(sourceStats.entries())
    .map(([source, stats]) => {
      const leads = normalizeSafeNumber(stats.projectLeads + stats.vacancyLeads);
      return {
        source,
        leads,
        conversionRate: percentage(leads, stats.pageViews),
      };
    })
    .filter((row) => row.leads > 0)
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 5);
}

function addSourceStats(
  statsMap: Map<string, { pageViews: number; projectLeads: number; vacancyLeads: number }>,
  source: string,
  input: Partial<{ pageViews: number; projectLeads: number; vacancyLeads: number }>,
): void {
  const current = statsMap.get(source) ?? { pageViews: 0, projectLeads: 0, vacancyLeads: 0 };
  current.pageViews += normalizeSafeNumber(input.pageViews ?? 0);
  current.projectLeads += normalizeSafeNumber(input.projectLeads ?? 0);
  current.vacancyLeads += normalizeSafeNumber(input.vacancyLeads ?? 0);
  statsMap.set(source, current);
}

// Source block is derived dynamically from source field values in analytics events.
async function getSourcePerformance(last30Days: DateRange): Promise<SourcePerformanceDto[]> {
  const sourceStats = new Map<string, { pageViews: number; projectLeads: number; vacancyLeads: number }>();

  await Promise.all([
    scanAnalyticsEventsByTypeInRange('page_view', last30Days, (data) => {
      const source = normalizeSourceValue(data.source);
      if (!source) return;
      addSourceStats(sourceStats, source, { pageViews: 1 });
    }),
    scanAnalyticsEventsByTypeInRange('submit_project', last30Days, (data) => {
      const source = normalizeSourceValue(data.source);
      if (!source) return;
      addSourceStats(sourceStats, source, { projectLeads: 1 });
    }),
    scanAnalyticsEventsByTypeInRange('submit_vacancy', last30Days, (data) => {
      const source = normalizeSourceValue(data.source);
      if (!source) return;
      addSourceStats(sourceStats, source, { vacancyLeads: 1 });
    }),
    scanAnalyticsEventsByTypeInRange('apply_vacancy', last30Days, (data) => {
      const source = normalizeSourceValue(data.source);
      if (!source) return;
      addSourceStats(sourceStats, source, { vacancyLeads: 1 });
    }),
  ]);

  return sortTopSources(sourceStats);
}

async function getPortfolioTitleBySlug(slug: string): Promise<string | null> {
  const firestore = getFirestoreDb();

  try {
    const snapshot = await firestore.collection('portfolio').where('slug', '==', slug).limit(1).get();
    const first = snapshot.docs[0];
    if (!first) return null;

    const title = first.data().title;
    return typeof title === 'string' && title.trim().length > 0 ? title.trim() : null;
  } catch {
    return null;
  }
}

function extractPortfolioSlug(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const map = metadata as Record<string, unknown>;
  const slug = map.slug;
  if (typeof slug !== 'string') return null;
  const normalized = slug.trim();
  return normalized.length > 0 ? normalized : null;
}

function extractPortfolioTitle(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const map = metadata as Record<string, unknown>;
  const titleCandidates = [map.title, map.portfolioTitle, map.name];

  for (const value of titleCandidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

// Computes top portfolio item by scanning all page_view events within the 30d window.
async function getTopPortfolioItem(last30Days: DateRange): Promise<{ title: string; views: number }> {
  const portfolioViews = new Map<string, { views: number; title: string | null }>();

  await scanAnalyticsEventsByTypeInRange('page_view', last30Days, (data) => {
    const metadata = data.metadata;
    const slug = extractPortfolioSlug(metadata);
    if (!slug) return;

    const existing = portfolioViews.get(slug);
    if (existing) {
      existing.views += 1;
      return;
    }

    portfolioViews.set(slug, {
      views: 1,
      title: extractPortfolioTitle(metadata),
    });
  });

  const top = Array.from(portfolioViews.entries())
    .map(([slug, value]) => ({
      slug,
      views: normalizeSafeNumber(value.views),
      title: value.title,
    }))
    .sort((a, b) => b.views - a.views)[0];

  if (!top || top.views <= 0) {
    return { title: 'No data', views: 0 };
  }

  const resolvedTitle = top.title ?? (await getPortfolioTitleBySlug(top.slug)) ?? top.slug;
  return { title: resolvedTitle, views: top.views };
}

function weekdayName(day: number): string {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day] ?? 'N/A';
}

// Weekday insight based on project leads concentration and traffic delta.
function getWeekdayInsights(dayRanges: DateRange[], projectLeadsByDay: number[], trafficVsLeads: TrafficVsLeadsPointDto[]) {
  const weekdayLeadTotals = new Map<number, number>();
  const weekdayTrafficTotals = new Map<number, number>();
  const weekdayTrafficDays = new Map<number, number>();

  dayRanges.forEach((range, index) => {
    const weekday = range.start.getUTCDay();
    const projectCount = projectLeadsByDay[index] ?? 0;
    const trafficCount = trafficVsLeads[index]?.traffic ?? 0;

    weekdayLeadTotals.set(weekday, (weekdayLeadTotals.get(weekday) ?? 0) + projectCount);
    weekdayTrafficTotals.set(weekday, (weekdayTrafficTotals.get(weekday) ?? 0) + trafficCount);
    weekdayTrafficDays.set(weekday, (weekdayTrafficDays.get(weekday) ?? 0) + 1);
  });

  let bestWeekday = 0;
  let bestLeadCount = 0;

  for (const [weekday, total] of weekdayLeadTotals.entries()) {
    if (total > bestLeadCount) {
      bestWeekday = weekday;
      bestLeadCount = total;
    }
  }

  const totalProjectLeads = projectLeadsByDay.reduce((sum, value) => sum + value, 0);
  const bestDayShare = percentage(bestLeadCount, totalProjectLeads);

  const totalTraffic = trafficVsLeads.reduce((sum, item) => sum + item.traffic, 0);
  const avgDailyTraffic = totalTraffic > 0 ? totalTraffic / trafficVsLeads.length : 0;

  const bestDayTrafficTotal = weekdayTrafficTotals.get(bestWeekday) ?? 0;
  const bestDayTrafficDays = weekdayTrafficDays.get(bestWeekday) ?? 0;
  const bestDayTrafficAvg = bestDayTrafficDays > 0 ? bestDayTrafficTotal / bestDayTrafficDays : 0;

  const bestDayTrafficDeltaPct = avgDailyTraffic <= 0
    ? 0
    : normalizeSafeRate(((bestDayTrafficAvg - avgDailyTraffic) / avgDailyTraffic) * 100);

  return {
    bestDay: weekdayName(bestWeekday),
    bestDayShare,
    bestDayTrafficDeltaPct,
  };
}

// Funnel snapshot keeps a compact executive ratio view.
function buildFunnel(pageViews: number, projectLeads: number, vacancyLeads: number): FunnelDto {
  const totalLeads = normalizeSafeNumber(projectLeads + vacancyLeads);
  const conversionPct = percentage(totalLeads, pageViews);
  const leadToTrafficRatio = conversionPct;
  const dropOffPct = pageViews <= 0 ? 0 : normalizeSafeRate(((pageViews - totalLeads) / pageViews) * 100);

  return {
    pageViews: normalizeSafeNumber(pageViews),
    projectLeads: normalizeSafeNumber(projectLeads),
    vacancyLeads: normalizeSafeNumber(vacancyLeads),
    totalLeads,
    conversionPct,
    leadToTrafficRatio,
    dropOffPct,
    projectLeadMixPct: percentage(projectLeads, totalLeads),
    vacancyLeadMixPct: percentage(vacancyLeads, totalLeads),
  };
}

// Alert rules stay deterministic and threshold-driven by design.
function buildAlerts(input: {
  trafficWowPct: number;
  conversionWowPct: number;
  leadWowPct: number;
  vacancyLeadsWowPct: number;
}): AlertDto[] {
  const alerts: AlertDto[] = [];

  if (input.trafficWowPct <= -25) {
    alerts.push({
      id: 'traffic-drop',
      level: 'warning',
      message: `Traffic decreased ${Math.abs(input.trafficWowPct).toFixed(2)}% compared to last week.`,
    });
  }

  if (input.conversionWowPct <= -20) {
    alerts.push({
      id: 'conversion-drop',
      level: 'alert',
      message: 'Conversion rate dropped significantly.',
    });
  }

  if (input.leadWowPct >= 50) {
    alerts.push({
      id: 'lead-growth',
      level: 'anomaly',
      message: `Project lead growth accelerated by ${input.leadWowPct.toFixed(2)}%.`,
    });
  }

  if (input.vacancyLeadsWowPct >= 70) {
    alerts.push({
      id: 'vacancy-spike',
      level: 'volatility',
      message: 'Vacancy leads spiked sharply compared to last week.',
    });
  }

  return alerts.slice(0, 3);
}

export async function getDashboardRawAggregates(): Promise<DashboardRawAggregates> {
  const firestore = getFirestoreDb();

  const todayStart = startOfUtcDay(new Date());
  const currentYearStart = new Date(Date.UTC(todayStart.getUTCFullYear(), 0, 1));
  const last7Days = getRangeFromDays(todayStart, 7, 0);
  const previous7Days = getRangeFromDays(todayStart, 7, 7);
  const last30Days = getRangeFromDays(todayStart, 30, 0);
  const previous30Days = getRangeFromDays(todayStart, 30, 30);
  const currentYearRange: DateRange = {
    start: currentYearStart,
    end: addDays(todayStart, 1),
  };
  const dayRanges30 = getDayRanges(todayStart, 30);
  const monthRangesYear = getCurrentYearMonthRanges(todayStart);

  const submissionsTotalQuery = firestore.collection('submissions');
  const activeVacanciesQuery = firestore.collection('vacancies').where('isPublished', '==', true);
  const portfolioTotalQuery = firestore.collection('portfolio');

  const submissionsLast7Query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(last7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last7Days.end));

  const submissionsPrev7Query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(previous7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous7Days.end));

  const submissionsLast30Query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(last30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last30Days.end));

  const submissionsPrev30Query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(previous30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous30Days.end));

  const vacanciesLast7Query = firestore
    .collection('vacancies')
    .where('createdAt', '>=', Timestamp.fromDate(last7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last7Days.end))
    .where('isPublished', '==', true);

  const vacanciesPrev7Query = firestore
    .collection('vacancies')
    .where('createdAt', '>=', Timestamp.fromDate(previous7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous7Days.end))
    .where('isPublished', '==', true);

  const vacanciesLast30Query = firestore
    .collection('vacancies')
    .where('createdAt', '>=', Timestamp.fromDate(last30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last30Days.end))
    .where('isPublished', '==', true);

  const vacanciesPrev30Query = firestore
    .collection('vacancies')
    .where('createdAt', '>=', Timestamp.fromDate(previous30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous30Days.end))
    .where('isPublished', '==', true);

  const portfolioLast7Query = firestore
    .collection('portfolio')
    .where('createdAt', '>=', Timestamp.fromDate(last7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last7Days.end));

  const portfolioPrev7Query = firestore
    .collection('portfolio')
    .where('createdAt', '>=', Timestamp.fromDate(previous7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous7Days.end));

  const portfolioLast30Query = firestore
    .collection('portfolio')
    .where('createdAt', '>=', Timestamp.fromDate(last30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last30Days.end));

  const portfolioPrev30Query = firestore
    .collection('portfolio')
    .where('createdAt', '>=', Timestamp.fromDate(previous30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous30Days.end));

  const [
    totalSubmissions,
    activeVacancies,
    portfolioItems,
    totalSubmissionsLast7,
    totalSubmissionsPrev7,
    totalSubmissionsLast30,
    totalSubmissionsPrev30,
    activeVacanciesLast7,
    activeVacanciesPrev7,
    activeVacanciesLast30,
    activeVacanciesPrev30,
    portfolioItemsLast7,
    portfolioItemsPrev7,
    portfolioItemsLast30,
    portfolioItemsPrev30,
    vacancyActionsLast7,
    vacancyActionsPrev7,
    vacancyActionsLast30,
    vacancyActionsPrev30,
    portfolioActionsLast7,
    portfolioActionsPrev7,
    portfolioActionsLast30,
    portfolioActionsPrev30,
    projectLeadsCurrent,
    projectLeadsPrevious,
    projectLeadsLast30,
    projectLeadsPrev30,
    vacancyLeadsCurrent,
    vacancyLeadsPrevious,
    vacancyLeadsLast30,
    vacancyLeadsPrev30,
    projectLeadsYear,
    vacancyLeadsYear,
    pageViewsCurrent,
    pageViewsPrevious,
    pageViewsLast30,
    pageViewsPrev30,
    submissionsTrend,
    trafficVsLeads,
    projectLeadsByDay,
    leadDistributionYearMonthly,
    topVacancies,
    sources,
    topPortfolio,
  ] = await Promise.all([
    readCount(submissionsTotalQuery, 'Failed to count total submissions'),
    readCount(activeVacanciesQuery, 'Failed to count active vacancies'),
    readCount(portfolioTotalQuery, 'Failed to count portfolio items'),
    readCount(submissionsLast7Query, 'Failed to count submissions for last 7 days'),
    readCount(submissionsPrev7Query, 'Failed to count submissions for previous 7 days'),
    readCount(submissionsLast30Query, 'Failed to count submissions for last 30 days'),
    readCount(submissionsPrev30Query, 'Failed to count submissions for previous 30 days'),
    readCount(vacanciesLast7Query, 'Failed to count active vacancies for last 7 days'),
    readCount(vacanciesPrev7Query, 'Failed to count active vacancies for previous 7 days'),
    readCount(vacanciesLast30Query, 'Failed to count active vacancies for last 30 days'),
    readCount(vacanciesPrev30Query, 'Failed to count active vacancies for previous 30 days'),
    readCount(portfolioLast7Query, 'Failed to count portfolio items for last 7 days'),
    readCount(portfolioPrev7Query, 'Failed to count portfolio items for previous 7 days'),
    readCount(portfolioLast30Query, 'Failed to count portfolio items for last 30 days'),
    readCount(portfolioPrev30Query, 'Failed to count portfolio items for previous 30 days'),
    countAdminActionsInRange('vacancies.manage', last7Days),
    countAdminActionsInRange('vacancies.manage', previous7Days),
    countAdminActionsInRange('vacancies.manage', last30Days),
    countAdminActionsInRange('vacancies.manage', previous30Days),
    countAdminActionsInRange('portfolio.manage', last7Days),
    countAdminActionsInRange('portfolio.manage', previous7Days),
    countAdminActionsInRange('portfolio.manage', last30Days),
    countAdminActionsInRange('portfolio.manage', previous30Days),
    countAnalyticsEventInRange('submit_project', last7Days),
    countAnalyticsEventInRange('submit_project', previous7Days),
    countAnalyticsEventInRange('submit_project', last30Days),
    countAnalyticsEventInRange('submit_project', previous30Days),
    countVacancyLeadsInRange(last7Days),
    countVacancyLeadsInRange(previous7Days),
    countVacancyLeadsInRange(last30Days),
    countVacancyLeadsInRange(previous30Days),
    countAnalyticsEventInRange('submit_project', currentYearRange),
    countVacancyLeadsInRange(currentYearRange),
    countAnalyticsEventInRange('page_view', last7Days),
    countAnalyticsEventInRange('page_view', previous7Days),
    countAnalyticsEventInRange('page_view', last30Days),
    countAnalyticsEventInRange('page_view', previous30Days),
    getSubmissionsTrend(dayRanges30),
    getTrafficAndLeadsSeries(dayRanges30),
    getProjectLeadsByDay(dayRanges30),
    getLeadDistributionYearMonthly(monthRangesYear),
    getTopVacancies(last30Days),
    getSourcePerformance(last30Days),
    getTopPortfolioItem(last30Days),
  ]);

  const leadDistribution: LeadDistributionDto = {
    project: normalizeSafeNumber(projectLeadsLast30),
    vacancy: normalizeSafeNumber(vacancyLeadsLast30),
  };

  const leadDistributionYear: LeadDistributionDto = {
    project: normalizeSafeNumber(projectLeadsYear),
    vacancy: normalizeSafeNumber(vacancyLeadsYear),
  };

  const conversionCurrent = percentage(projectLeadsCurrent, pageViewsCurrent);
  const conversionPrevious = percentage(projectLeadsPrevious, pageViewsPrevious);

  // Keep MoM conversion semantics consistent with KPI: project submits vs page views.
  const conversionLast30 = percentage(projectLeadsLast30, pageViewsLast30);
  const conversionPrev30 = percentage(projectLeadsPrev30, pageViewsPrev30);

  const activeVacanciesCurrentWoW = normalizeSafeNumber(Math.max(activeVacanciesLast7, vacancyActionsLast7));
  const activeVacanciesPreviousWoW = normalizeSafeNumber(Math.max(activeVacanciesPrev7, vacancyActionsPrev7));

  const portfolioItemsCurrentWoW = normalizeSafeNumber(Math.max(portfolioItemsLast7, portfolioActionsLast7));
  const portfolioItemsPreviousWoW = normalizeSafeNumber(Math.max(portfolioItemsPrev7, portfolioActionsPrev7));

  const activeVacanciesCurrentMoM = normalizeSafeNumber(Math.max(activeVacanciesLast30, vacancyActionsLast30));
  const activeVacanciesPreviousMoM = normalizeSafeNumber(Math.max(activeVacanciesPrev30, vacancyActionsPrev30));

  const portfolioItemsCurrentMoM = normalizeSafeNumber(Math.max(portfolioItemsLast30, portfolioActionsLast30));
  const portfolioItemsPreviousMoM = normalizeSafeNumber(Math.max(portfolioItemsPrev30, portfolioActionsPrev30));

  const funnel = buildFunnel(pageViewsLast30, projectLeadsLast30, vacancyLeadsLast30);

  const weekdayInsights = getWeekdayInsights(dayRanges30, projectLeadsByDay, trafficVsLeads);

  const topVacancy = topVacancies[0] ?? {
    label: 'No data',
    applications: 0,
  };

  const leadQualityRatio = percentage(projectLeadsLast30, projectLeadsLast30 + vacancyLeadsLast30);

  const growthVelocityMoM = pctChange(
    projectLeadsLast30 + vacancyLeadsLast30,
    projectLeadsPrev30 + vacancyLeadsPrev30,
  );

  const conversionDropOffPct = conversionLast30 >= conversionPrev30
    ? 0
    : normalizeSafeRate(conversionPrev30 - conversionLast30);

  const alerts = buildAlerts({
    trafficWowPct: pctChange(pageViewsCurrent, pageViewsPrevious),
    conversionWowPct: pctChange(conversionCurrent, conversionPrevious),
    leadWowPct: pctChange(projectLeadsCurrent, projectLeadsPrevious),
    vacancyLeadsWowPct: pctChange(vacancyLeadsCurrent, vacancyLeadsPrevious),
  });

  return {
    totals: {
      totalSubmissions: normalizeSafeNumber(totalSubmissions),
      projectLeads: normalizeSafeNumber(projectLeadsCurrent),
      vacancyLeads: normalizeSafeNumber(vacancyLeadsCurrent),
      activeVacancies: normalizeSafeNumber(activeVacancies),
      portfolioItems: normalizeSafeNumber(portfolioItems),
      conversionRate7d: conversionCurrent,
    },
    windows: {
      totalSubmissions: {
        current: normalizeSafeNumber(totalSubmissionsLast7),
        previous: normalizeSafeNumber(totalSubmissionsPrev7),
      },
      projectLeads: {
        current: normalizeSafeNumber(projectLeadsCurrent),
        previous: normalizeSafeNumber(projectLeadsPrevious),
      },
      vacancyLeads: {
        current: normalizeSafeNumber(vacancyLeadsCurrent),
        previous: normalizeSafeNumber(vacancyLeadsPrevious),
      },
      activeVacancies: {
        current: activeVacanciesCurrentWoW,
        previous: activeVacanciesPreviousWoW,
      },
      portfolioItems: {
        current: portfolioItemsCurrentWoW,
        previous: portfolioItemsPreviousWoW,
      },
      conversionRate7d: {
        current: conversionCurrent,
        previous: conversionPrevious,
      },
    },
    windowsMoM: {
      totalSubmissions: {
        current: normalizeSafeNumber(totalSubmissionsLast30),
        previous: normalizeSafeNumber(totalSubmissionsPrev30),
      },
      projectLeads: {
        current: normalizeSafeNumber(projectLeadsLast30),
        previous: normalizeSafeNumber(projectLeadsPrev30),
      },
      vacancyLeads: {
        current: normalizeSafeNumber(vacancyLeadsLast30),
        previous: normalizeSafeNumber(vacancyLeadsPrev30),
      },
      activeVacancies: {
        current: activeVacanciesCurrentMoM,
        previous: activeVacanciesPreviousMoM,
      },
      portfolioItems: {
        current: portfolioItemsCurrentMoM,
        previous: portfolioItemsPreviousMoM,
      },
      conversionRate7d: {
        current: conversionLast30,
        previous: conversionPrev30,
      },
    },
    derived: {
      alerts,
      funnel,
      sources,
      leadQualityRatio,
      bestDay: weekdayInsights.bestDay,
      bestDayShare: weekdayInsights.bestDayShare,
      bestDayTrafficDeltaPct: weekdayInsights.bestDayTrafficDeltaPct,
      topPortfolioItem: topPortfolio.title,
      topPortfolioViews: topPortfolio.views,
      topVacancyItem: topVacancy.label,
      topVacancyApplications: normalizeSafeNumber(topVacancy.applications),
      growthVelocityMoM,
      conversionDropOffPct,
    },
    charts: {
      submissionsTrend,
      leadDistribution,
      leadDistributionYear,
      leadDistributionYearMonthly,
      topVacancies,
      trafficVsLeads,
    },
  };
}
