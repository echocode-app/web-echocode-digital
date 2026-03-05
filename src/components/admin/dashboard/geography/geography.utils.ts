import type { DashboardGeographyCountryDto } from '@/server/admin/dashboard/dashboard.types';

export const GEOGRAPHY_CHART_COLORS = [
  'rgba(253, 38, 108, 0.82)',
  'rgba(250, 193, 117, 0.88)',
  'rgba(72, 213, 151, 0.86)',
  'rgba(92, 147, 255, 0.86)',
  'rgba(180, 128, 255, 0.86)',
  'rgba(255, 133, 133, 0.86)',
  'rgba(148, 163, 184, 0.9)',
] as const;

const COUNTRY_NAME_RESOLVER =
  typeof Intl !== 'undefined' && typeof Intl.DisplayNames !== 'undefined'
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

export type GeographyChartRow = {
  key: string;
  label: string;
  views: number;
  sharePct: number;
  color: string;
};

export function resolveCountryLabel(countryCode: string): string {
  if (countryCode === 'Unknown') {
    return 'Unknown';
  }

  if (countryCode.length === 2 && COUNTRY_NAME_RESOLVER) {
    return COUNTRY_NAME_RESOLVER.of(countryCode) ?? countryCode;
  }

  return countryCode;
}

export function buildGeographyChartRows(
  countries: DashboardGeographyCountryDto[],
  topLimit = 6,
): GeographyChartRow[] {
  const topRows = countries.slice(0, topLimit);
  const restRows = countries.slice(topLimit);
  const restViews = restRows.reduce((acc, item) => acc + item.views, 0);
  const restPct = restRows.reduce((acc, item) => acc + item.sharePct, 0);

  const chartRows = topRows.map((item, index) => ({
    key: item.country,
    label: resolveCountryLabel(item.country),
    views: item.views,
    sharePct: item.sharePct,
    color: GEOGRAPHY_CHART_COLORS[index % GEOGRAPHY_CHART_COLORS.length] ?? GEOGRAPHY_CHART_COLORS[0],
  }));

  if (restViews > 0) {
    chartRows.push({
      key: 'other',
      label: 'Other',
      views: restViews,
      sharePct: Number(restPct.toFixed(2)),
      color: GEOGRAPHY_CHART_COLORS[GEOGRAPHY_CHART_COLORS.length - 1] ?? 'rgba(148, 163, 184, 0.9)',
    });
  }

  return chartRows;
}
