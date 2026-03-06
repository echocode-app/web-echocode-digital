import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';

type MetricLike = SubmissionsOverviewDto['kpis']['submissions7d'];

export function zeroMetric(): MetricLike {
  return {
    value: 0,
    trend: { current: 0, previous: 0, changePct: 0, direction: 'flat' },
    momChangePct: null,
  };
}

export function buildReadyOverview(activeOverview: SubmissionsOverviewDto | null): SubmissionsOverviewDto | null {
  if (!activeOverview) return null;

  return {
    ...activeOverview,
    kpis: {
      submissions7d: activeOverview.kpis.submissions7d ?? zeroMetric(),
      conversion7d: activeOverview.kpis.conversion7d ?? zeroMetric(),
      avgSubmitTime7d: activeOverview.kpis.avgSubmitTime7d ?? zeroMetric(),
      errorRate7d: activeOverview.kpis.errorRate7d ?? zeroMetric(),
    },
    charts: {
      submissionsTrend: activeOverview.charts.submissionsTrend ?? [],
      errorsTrend: activeOverview.charts.errorsTrend ?? [],
    },
  };
}
