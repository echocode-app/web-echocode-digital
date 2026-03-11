import { addDays, getRangeFromDays, scanAnalyticsEventsByTypeInRange, startOfUtcDay } from '@/server/admin/dashboard/dashboard.repository.core';
import type { DashboardPeriod, DashboardGeographyRaw, DashboardGeographyRawCountry } from '@/server/admin/dashboard/dashboard.types';
import type { SiteId } from '@/server/sites/siteContext';
import { startOfAdminMonth, startOfAdminYear } from '@/shared/time/europeKiev';

function normalizeCountry(input: unknown): string {
  if (typeof input !== 'string') {
    return 'Unknown';
  }

  const normalized = input.trim();
  if (!normalized) {
    return 'Unknown';
  }

  return normalized.toUpperCase();
}

function resolveRange(period: DashboardPeriod): { start: Date; end: Date } {
  const todayStart = startOfUtcDay(new Date());

  if (period === 'week') {
    return getRangeFromDays(todayStart, 7, 0);
  }

  if (period === 'month') {
    return {
      start: startOfAdminMonth(todayStart),
      end: addDays(todayStart, 1),
    };
  }

  return {
    start: startOfAdminYear(todayStart),
    end: addDays(todayStart, 1),
  };
}

function toCountries(counts: Map<string, number>, total: number): DashboardGeographyRawCountry[] {
  const rows = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([country, views]) => ({
      country,
      views,
      sharePct: total > 0 ? Number(((views / total) * 100).toFixed(2)) : 0,
    }));

  return rows;
}

// Aggregates page-view geography for the selected UTC period.
export async function getDashboardGeographyRaw(
  period: DashboardPeriod,
  options: { siteId?: SiteId } = {},
): Promise<DashboardGeographyRaw> {
  const range = resolveRange(period);
  const counts = new Map<string, number>();
  let totalPageViews = 0;

  await scanAnalyticsEventsByTypeInRange(
    'page_view',
    range,
    (data) => {
      totalPageViews += 1;
      const country = normalizeCountry(data.country);
      counts.set(country, (counts.get(country) ?? 0) + 1);
    },
    options,
  );

  return {
    period,
    totalPageViews,
    countries: toCountries(counts, totalPageViews),
  };
}
