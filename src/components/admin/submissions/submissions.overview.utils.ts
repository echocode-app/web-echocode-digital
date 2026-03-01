import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';

type MetricLike = SubmissionsOverviewDto['kpis']['submissions7d'];

const DAY_MS = 24 * 60 * 60 * 1000;

function buildCurrentMonthDates(): string[] {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();
  const monthStart = new Date(Date.UTC(year, month, 1));
  const nextMonthStart = new Date(Date.UTC(year, month + 1, 1));
  const daysInMonth = Math.round((nextMonthStart.getTime() - monthStart.getTime()) / DAY_MS);

  return Array.from({ length: daysInMonth }, (_, index) => {
    const d = new Date(monthStart.getTime() + index * DAY_MS);
    return d.toISOString().slice(0, 10);
  });
}

function buildMonthsToDate(): string[] {
  return Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
}

export function zeroMetric(): MetricLike {
  return {
    value: 0,
    trend: { current: 0, previous: 0, changePct: 0, direction: 'flat' },
    momChangePct: null,
  };
}

export function normalizeMonthlyTrend(
  trend: SubmissionsOverviewDto['charts']['submissionsTrendYtd'] | undefined,
): SubmissionsOverviewDto['charts']['submissionsTrendYtd'] {
  const source = new Map((trend ?? []).map((item) => [item.month, item.value]));
  return buildMonthsToDate().map((month) => ({
    month,
    value: source.get(month) ?? 0,
  }));
}

export function normalizeErrorsTrend(
  trend: SubmissionsOverviewDto['charts']['errorsTrendCurrentMonth'] | undefined,
): NonNullable<SubmissionsOverviewDto['charts']['errorsTrendCurrentMonth']> {
  const source = new Map((trend ?? []).map((item) => [item.date, item]));
  return buildCurrentMonthDates().map((date) => {
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
      submissionsTrendYtd: normalizeMonthlyTrend(activeOverview.charts.submissionsTrendYtd),
      errorsTrendCurrentMonth: normalizeErrorsTrend(activeOverview.charts.errorsTrendCurrentMonth),
    },
  };
}
