import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';

type MetricLike = SubmissionsOverviewDto['kpis']['submissions7d'];

const DAY_MS = 24 * 60 * 60 * 1000;

function buildLast30Dates(): string[] {
  const today = new Date();
  const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  return Array.from({ length: 30 }, (_, index) => {
    const d = new Date(utcToday.getTime() - (29 - index) * DAY_MS);
    return d.toISOString().slice(0, 10);
  });
}

function buildMonthsToDate(): string[] {
  const currentMonthIndex = new Date().getUTCMonth();
  return Array.from({ length: currentMonthIndex + 1 }, (_, index) => String(index + 1).padStart(2, '0'));
}

export function zeroMetric(): MetricLike {
  return {
    value: 0,
    trend: { current: 0, previous: 0, changePct: 0, direction: 'flat' },
    momChangePct: null,
  };
}

export function normalizeMonthlyTrend(
  trend: SubmissionsOverviewDto['charts']['submissionsTrend30d'] | undefined,
): SubmissionsOverviewDto['charts']['submissionsTrend30d'] {
  const source = new Map((trend ?? []).map((item) => [item.month, item.value]));
  return buildMonthsToDate().map((month) => ({
    month,
    value: source.get(month) ?? 0,
  }));
}

export function normalizeErrorsTrend(
  trend: SubmissionsOverviewDto['charts']['errorsTrend30d'] | undefined,
): NonNullable<SubmissionsOverviewDto['charts']['errorsTrend30d']> {
  const source = new Map((trend ?? []).map((item) => [item.date, item]));
  return buildLast30Dates().map((date) => {
    const item = source.get(date);
    return {
      date,
      success: item?.success ?? 0,
      error: item?.error ?? 0,
    };
  });
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
      submissionsTrend30d: normalizeMonthlyTrend(activeOverview.charts.submissionsTrend30d),
      errorsTrend30d: normalizeErrorsTrend(activeOverview.charts.errorsTrend30d),
    },
  };
}
