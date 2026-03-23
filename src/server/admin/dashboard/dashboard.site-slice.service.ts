import type {
  DashboardGeographyCountryDto,
  DashboardKpiDto,
  DashboardPeriod,
  DashboardReferrerDto,
  DashboardSiteSliceOverviewDto,
  DashboardTopPageDto,
  TrendDirection,
  TrendStats,
} from '@/server/admin/dashboard/dashboard.types';
import {
  addDays,
  countAnalyticsEventInRange,
  scanAnalyticsEventsByTypeInRange,
  startOfUtcDay,
  type DateRange,
} from '@/server/admin/dashboard/dashboard.repository.core';
import { startOfAdminMonth, startOfAdminYear } from '@/shared/time/europeKiev';

const MAIN_SITE_ID = 'echocode_digital' as const;
const MAX_LIST_ROWS = 8;

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Number(value.toFixed(2));
}

function toTrend(current: number, previous: number): TrendStats {
  const safeCurrent = sanitizeNumber(current);
  const safePrevious = sanitizeNumber(previous);

  if (safePrevious === 0 && safeCurrent === 0) {
    return { current: safeCurrent, previous: safePrevious, changePct: 0, direction: 'flat' };
  }

  if (safePrevious === 0) {
    return { current: safeCurrent, previous: safePrevious, changePct: 100, direction: 'up' };
  }

  const changePct = Number((((safeCurrent - safePrevious) / safePrevious) * 100).toFixed(2));
  let direction: TrendDirection = 'flat';
  if (changePct > 0) direction = 'up';
  if (changePct < 0) direction = 'down';

  return { current: safeCurrent, previous: safePrevious, changePct, direction };
}

function toMoMChange(current: number, previous: number): number | null {
  const safeCurrent = sanitizeNumber(current);
  const safePrevious = sanitizeNumber(previous);

  if (safePrevious === 0 && safeCurrent === 0) return 0;
  if (safePrevious === 0) return null;
  return Number((((safeCurrent - safePrevious) / safePrevious) * 100).toFixed(2));
}

function toKpi(
  value: number,
  wowCurrent: number,
  wowPrevious: number,
  momCurrent: number,
  momPrevious: number,
): DashboardKpiDto {
  return {
    value: sanitizeNumber(value),
    trend: toTrend(wowCurrent, wowPrevious),
    momChangePct: toMoMChange(momCurrent, momPrevious),
  };
}

function resolveRanges(period: DashboardPeriod): {
  current: DateRange;
  previous: DateRange;
  last30: DateRange;
  previous30: DateRange;
} {
  const todayStart = startOfUtcDay(new Date());
  const tomorrow = addDays(todayStart, 1);
  const last30: DateRange = {
    start: addDays(tomorrow, -30),
    end: tomorrow,
  };
  const previous30: DateRange = {
    start: addDays(last30.start, -30),
    end: last30.start,
  };

  if (period === 'week') {
    const current: DateRange = {
      start: addDays(tomorrow, -7),
      end: tomorrow,
    };
    const previous: DateRange = {
      start: addDays(current.start, -7),
      end: current.start,
    };

    return { current, previous, last30, previous30 };
  }

  const rangeStart =
    period === 'month' ? startOfAdminMonth(todayStart) : startOfAdminYear(todayStart);
  const durationMs = tomorrow.getTime() - rangeStart.getTime();
  const current: DateRange = { start: rangeStart, end: tomorrow };
  const previous: DateRange = {
    start: new Date(rangeStart.getTime() - durationMs),
    end: rangeStart,
  };

  return { current, previous, last30, previous30 };
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readMetadata(record: Record<string, unknown>): Record<string, unknown> | null {
  const value = record.metadata;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function getReferrerLabel(metadata: Record<string, unknown> | null): string {
  if (!metadata) return 'Direct / unknown';

  const attribution = metadata.attribution;
  if (attribution && typeof attribution === 'object' && !Array.isArray(attribution)) {
    const source = readString(attribution as Record<string, unknown>, 'source');
    const medium = readString(attribution as Record<string, unknown>, 'medium');
    if (source && medium) return `${source} / ${medium}`;
    if (source) return source;
  }

  const rawReferrer = readString(metadata, 'referrer');
  if (!rawReferrer) return 'Direct / unknown';

  try {
    return new URL(rawReferrer).host;
  } catch {
    return rawReferrer;
  }
}

function toRankedRows<T extends { views: number }>(
  map: Map<string, number>,
  total: number,
  limit: number | null,
  buildRow: (label: string, views: number, sharePct: number) => T,
): T[] {
  const sortedEntries = Array.from(map.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  const limitedEntries = limit === null ? sortedEntries : sortedEntries.slice(0, limit);

  return limitedEntries
    .map(([label, views]) =>
      buildRow(label, views, total > 0 ? sanitizeNumber((views / total) * 100) : 0),
    );
}

function resolveTopRowShare(rows: Array<{ sharePct: number }>): number {
  return sanitizeNumber(rows[0]?.sharePct ?? 0);
}

export async function getAdminDashboardSiteSliceOverview(
  period: DashboardPeriod = 'week',
): Promise<DashboardSiteSliceOverviewDto> {
  const ranges = resolveRanges(period);

  const [pageViewsCurrent, pageViewsPrevious, pageViewsLast30, pageViewsPrev30] = await Promise.all(
    [
      countAnalyticsEventInRange('page_view', ranges.current, { siteId: MAIN_SITE_ID }),
      countAnalyticsEventInRange('page_view', ranges.previous, { siteId: MAIN_SITE_ID }),
      countAnalyticsEventInRange('page_view', ranges.last30, { siteId: MAIN_SITE_ID }),
      countAnalyticsEventInRange('page_view', ranges.previous30, { siteId: MAIN_SITE_ID }),
    ],
  );

  const pageCounts = new Map<string, number>();
  const referrerCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();

  await scanAnalyticsEventsByTypeInRange(
    'page_view',
    ranges.current,
    (data) => {
      const metadata = readMetadata(data);
      const path = readString(metadata ?? {}, 'path') ?? '/';
      const referrer = getReferrerLabel(metadata);
      const country = readString(data, 'country')?.toUpperCase() ?? 'Unknown';

      pageCounts.set(path, (pageCounts.get(path) ?? 0) + 1);
      referrerCounts.set(referrer, (referrerCounts.get(referrer) ?? 0) + 1);
      countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
    },
    { siteId: MAIN_SITE_ID },
  );

  const previousCountryCounts = new Map<string, number>();
  await scanAnalyticsEventsByTypeInRange(
    'page_view',
    ranges.previous,
    (data) => {
      const country = readString(data, 'country')?.toUpperCase() ?? 'Unknown';
      previousCountryCounts.set(country, (previousCountryCounts.get(country) ?? 0) + 1);
    },
    { siteId: MAIN_SITE_ID },
  );

  const previousPageCounts = new Map<string, number>();
  const previousReferrerCounts = new Map<string, number>();
  let previousPageViewsTotal = 0;

  await scanAnalyticsEventsByTypeInRange(
    'page_view',
    ranges.previous,
    (data) => {
      previousPageViewsTotal += 1;
      const metadata = readMetadata(data);
      const path = readString(metadata ?? {}, 'path') ?? '/';
      const referrer = getReferrerLabel(metadata);

      previousPageCounts.set(path, (previousPageCounts.get(path) ?? 0) + 1);
      previousReferrerCounts.set(referrer, (previousReferrerCounts.get(referrer) ?? 0) + 1);
    },
    { siteId: MAIN_SITE_ID },
  );

  const last30PageCounts = new Map<string, number>();
  const last30ReferrerCounts = new Map<string, number>();
  let last30PageViewsTotal = 0;

  await scanAnalyticsEventsByTypeInRange(
    'page_view',
    ranges.last30,
    (data) => {
      last30PageViewsTotal += 1;
      const metadata = readMetadata(data);
      const path = readString(metadata ?? {}, 'path') ?? '/';
      const referrer = getReferrerLabel(metadata);

      last30PageCounts.set(path, (last30PageCounts.get(path) ?? 0) + 1);
      last30ReferrerCounts.set(referrer, (last30ReferrerCounts.get(referrer) ?? 0) + 1);
    },
    { siteId: MAIN_SITE_ID },
  );

  const previous30PageCounts = new Map<string, number>();
  const previous30ReferrerCounts = new Map<string, number>();
  let previous30PageViewsTotal = 0;

  await scanAnalyticsEventsByTypeInRange(
    'page_view',
    ranges.previous30,
    (data) => {
      previous30PageViewsTotal += 1;
      const metadata = readMetadata(data);
      const path = readString(metadata ?? {}, 'path') ?? '/';
      const referrer = getReferrerLabel(metadata);

      previous30PageCounts.set(path, (previous30PageCounts.get(path) ?? 0) + 1);
      previous30ReferrerCounts.set(referrer, (previous30ReferrerCounts.get(referrer) ?? 0) + 1);
    },
    { siteId: MAIN_SITE_ID },
  );

  const countries: DashboardGeographyCountryDto[] = toRankedRows(
    countryCounts,
    pageViewsCurrent,
    null,
    (country, views, sharePct) => ({ country, views, sharePct }),
  );
  const topPages: DashboardTopPageDto[] = toRankedRows(
    pageCounts,
    pageViewsCurrent,
    MAX_LIST_ROWS,
    (path, views, sharePct) => ({ path, views, sharePct }),
  );
  const referrers: DashboardReferrerDto[] = toRankedRows(
    referrerCounts,
    pageViewsCurrent,
    MAX_LIST_ROWS,
    (label, views, sharePct) => ({ label, views, sharePct }),
  );

  const previousTopPages = toRankedRows(
    previousPageCounts,
    previousPageViewsTotal,
    1,
    (path, views, sharePct) => ({ path, views, sharePct }),
  );
  const last30TopPages = toRankedRows(
    last30PageCounts,
    last30PageViewsTotal,
    1,
    (path, views, sharePct) => ({ path, views, sharePct }),
  );
  const previous30TopPages = toRankedRows(
    previous30PageCounts,
    previous30PageViewsTotal,
    1,
    (path, views, sharePct) => ({ path, views, sharePct }),
  );

  const referrerSourcesCurrent = referrerCounts.size;
  const referrerSourcesPrevious = previousReferrerCounts.size;
  const referrerSourcesLast30 = last30ReferrerCounts.size;
  const referrerSourcesPrev30 = previous30ReferrerCounts.size;

  return {
    period,
    siteId: MAIN_SITE_ID,
    kpis: {
      pageViews: toKpi(
        pageViewsCurrent,
        pageViewsCurrent,
        pageViewsPrevious,
        pageViewsLast30,
        pageViewsPrev30,
      ),
      countries: toKpi(
        countryCounts.size,
        countryCounts.size,
        previousCountryCounts.size,
        countryCounts.size,
        previousCountryCounts.size,
      ),
      topPageShare: toKpi(
        resolveTopRowShare(topPages),
        resolveTopRowShare(topPages),
        resolveTopRowShare(previousTopPages),
        resolveTopRowShare(last30TopPages),
        resolveTopRowShare(previous30TopPages),
      ),
      referrerSources: toKpi(
        referrerSourcesCurrent,
        referrerSourcesCurrent,
        referrerSourcesPrevious,
        referrerSourcesLast30,
        referrerSourcesPrev30,
      ),
    },
    geography: {
      period,
      totalPageViews: sanitizeNumber(pageViewsCurrent),
      countries,
    },
    topPages,
    referrers,
  };
}
