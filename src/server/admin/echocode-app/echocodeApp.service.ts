import type {
  DashboardKpiDto,
  DashboardPeriod,
  TrendDirection,
  TrendStats,
} from '@/server/admin/dashboard/dashboard.types';
import {
  addDays,
  countAnalyticsEventInRange,
  percentage,
  scanAnalyticsEventsByTypeInRange,
  startOfUtcDay,
  type DateRange,
} from '@/server/admin/dashboard/dashboard.repository.core';
import { countScopedSubmissionsInRange } from '@/server/admin/submissions/submissions.metrics.queries';
import { startOfAdminMonth, startOfAdminYear } from '@/shared/time/europeKiev';
import { listSubmissions } from '@/server/submissions/submissions.list.service';
import type { ListSubmissionsQueryInput } from '@/server/submissions/submissions.types';
import type {
  EchocodeAppOverviewDto,
  EchocodeAppReferrerDto,
  EchocodeAppTopPageDto,
  EchocodeAppSubmissionsDto,
} from '@/server/admin/echocode-app/echocodeApp.types';

const SITE_ID = 'echocode_app' as const;
const SITE_HOST = 'echocode.app';
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
  last7: DateRange;
  previous7: DateRange;
  last30: DateRange;
  previous30: DateRange;
} {
  const todayStart = startOfUtcDay(new Date());
  const tomorrow = addDays(todayStart, 1);

  const last7: DateRange = {
    start: addDays(tomorrow, -7),
    end: tomorrow,
  };
  const previous7: DateRange = {
    start: addDays(last7.start, -7),
    end: last7.start,
  };
  const last30: DateRange = {
    start: addDays(tomorrow, -30),
    end: tomorrow,
  };
  const previous30: DateRange = {
    start: addDays(last30.start, -30),
    end: last30.start,
  };

  if (period === 'week') {
    return {
      current: last7,
      previous: previous7,
      last7,
      previous7,
      last30,
      previous30,
    };
  }

  const rangeStart =
    period === 'month' ? startOfAdminMonth(todayStart) : startOfAdminYear(todayStart);
  const durationMs = tomorrow.getTime() - rangeStart.getTime();
  const current: DateRange = { start: rangeStart, end: tomorrow };
  const previous: DateRange = {
    start: new Date(rangeStart.getTime() - durationMs),
    end: rangeStart,
  };

  return {
    current,
    previous,
    last7,
    previous7,
    last30,
    previous30,
  };
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

function toRankedRows<T extends { views: number }>(
  map: Map<string, number>,
  total: number,
  limit: number,
  buildRow: (label: string, views: number, sharePct: number) => T,
): T[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, views]) =>
      buildRow(label, views, total > 0 ? sanitizeNumber((views / total) * 100) : 0),
    );
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

export async function getAdminEchocodeAppOverview(
  period: DashboardPeriod = 'week',
): Promise<EchocodeAppOverviewDto> {
  const ranges = resolveRanges(period);

  const [
    pageViewsCurrent,
    pageViewsPrevious,
    pageViewsLast30,
    pageViewsPrev30,
    submissionsCurrent,
    submissionsPrevious,
    submissionsLast30,
    submissionsPrev30,
  ] = await Promise.all([
    countAnalyticsEventInRange('page_view', ranges.current, { siteId: SITE_ID }),
    countAnalyticsEventInRange('page_view', ranges.previous, { siteId: SITE_ID }),
    countAnalyticsEventInRange('page_view', ranges.last30, { siteId: SITE_ID }),
    countAnalyticsEventInRange('page_view', ranges.previous30, { siteId: SITE_ID }),
    countScopedSubmissionsInRange(ranges.current, {
      siteId: SITE_ID,
      includeClientSubmissions: false,
    }),
    countScopedSubmissionsInRange(ranges.previous, {
      siteId: SITE_ID,
      includeClientSubmissions: false,
    }),
    countScopedSubmissionsInRange(ranges.last30, {
      siteId: SITE_ID,
      includeClientSubmissions: false,
    }),
    countScopedSubmissionsInRange(ranges.previous30, {
      siteId: SITE_ID,
      includeClientSubmissions: false,
    }),
  ]);

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
    { siteId: SITE_ID },
  );

  const currentConversion = percentage(submissionsCurrent, pageViewsCurrent);
  const previousConversion = percentage(submissionsPrevious, pageViewsPrevious);
  const last30Conversion = percentage(submissionsLast30, pageViewsLast30);
  const prev30Conversion = percentage(submissionsPrev30, pageViewsPrev30);
  const currentCountries = countryCounts.size;

  const previousCountryCounts = new Map<string, number>();
  await scanAnalyticsEventsByTypeInRange(
    'page_view',
    ranges.previous,
    (data) => {
      const country = readString(data, 'country')?.toUpperCase() ?? 'Unknown';
      previousCountryCounts.set(country, (previousCountryCounts.get(country) ?? 0) + 1);
    },
    { siteId: SITE_ID },
  );

  const countries = toRankedRows(
    countryCounts,
    pageViewsCurrent,
    MAX_LIST_ROWS,
    (country, views, sharePct) => ({ country, views, sharePct }),
  );
  const topPages: EchocodeAppTopPageDto[] = toRankedRows(
    pageCounts,
    pageViewsCurrent,
    MAX_LIST_ROWS,
    (path, views, sharePct) => ({ path, views, sharePct }),
  );
  const referrers: EchocodeAppReferrerDto[] = toRankedRows(
    referrerCounts,
    pageViewsCurrent,
    MAX_LIST_ROWS,
    (label, views, sharePct) => ({ label, views, sharePct }),
  );

  return {
    period,
    siteId: SITE_ID,
    siteHost: SITE_HOST,
    kpis: {
      pageViews: toKpi(
        pageViewsCurrent,
        pageViewsCurrent,
        pageViewsPrevious,
        pageViewsLast30,
        pageViewsPrev30,
      ),
      submissions: toKpi(
        submissionsCurrent,
        submissionsCurrent,
        submissionsPrevious,
        submissionsLast30,
        submissionsPrev30,
      ),
      conversionRate: toKpi(
        currentConversion,
        currentConversion,
        previousConversion,
        last30Conversion,
        prev30Conversion,
      ),
      countries: toKpi(
        currentCountries,
        currentCountries,
        previousCountryCounts.size,
        currentCountries,
        previousCountryCounts.size,
      ),
    },
    geography: {
      totalPageViews: sanitizeNumber(pageViewsCurrent),
      countries,
    },
    topPages,
    referrers,
  };
}

export async function listAdminEchocodeAppSubmissions(
  query: Omit<ListSubmissionsQueryInput, 'siteId'>,
): Promise<EchocodeAppSubmissionsDto> {
  return listSubmissions({
    query: {
      ...query,
      siteId: SITE_ID,
    },
  });
}
