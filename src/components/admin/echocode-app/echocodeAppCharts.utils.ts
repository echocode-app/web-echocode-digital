import type { GeographyChartRow } from '@/components/admin/dashboard/geography/geography.utils';
import {
  GEOGRAPHY_CHART_COLORS,
  resolveCountryLabel,
} from '@/components/admin/dashboard/geography/geography.utils';

type ChartMetricRow = {
  views: number;
  sharePct: number;
};

type ChartMetricBuilderOptions<TItem extends ChartMetricRow> = {
  key: (item: TItem, index: number) => string;
  label: (item: TItem) => string;
  topLimit?: number;
};

export function buildMetricChartRows<TItem extends ChartMetricRow>(
  items: readonly TItem[],
  options: ChartMetricBuilderOptions<TItem>,
): GeographyChartRow[] {
  const topLimit = options.topLimit ?? 6;
  const topRows = items.slice(0, topLimit);
  const restRows = items.slice(topLimit);
  const restViews = restRows.reduce((acc, item) => acc + item.views, 0);
  const restPct = restRows.reduce((acc, item) => acc + item.sharePct, 0);

  const rows = topRows.map((item, index) => ({
    key: options.key(item, index),
    label: options.label(item),
    views: item.views,
    sharePct: item.sharePct,
    color:
      GEOGRAPHY_CHART_COLORS[index % GEOGRAPHY_CHART_COLORS.length] ?? GEOGRAPHY_CHART_COLORS[0],
    colorIndex: index % GEOGRAPHY_CHART_COLORS.length,
  }));

  if (restViews > 0) {
    rows.push({
      key: 'other',
      label: 'Other',
      views: restViews,
      sharePct: Number(restPct.toFixed(2)),
      color:
        GEOGRAPHY_CHART_COLORS[GEOGRAPHY_CHART_COLORS.length - 1] ?? 'rgba(148, 163, 184, 0.9)',
      colorIndex: GEOGRAPHY_CHART_COLORS.length - 1,
    });
  }

  return rows;
}

export function toCountryLabel(countryCode: string): string {
  return resolveCountryLabel(countryCode);
}
