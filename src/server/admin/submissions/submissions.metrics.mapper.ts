import type { DashboardKpiDto, TrendDirection, TrendStats } from '@/server/admin/dashboard/dashboard.types';
import type { SubmissionsOverviewRawAggregates } from '@/server/admin/submissions/submissions.metrics.repository';
import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Number(value.toFixed(2));
}

function toTrend(current: number, previous: number): TrendStats {
  const safeCurrent = sanitizeNumber(current);
  const safePrevious = sanitizeNumber(previous);

  if (safePrevious === 0 && safeCurrent === 0) {
    return {
      current: safeCurrent,
      previous: safePrevious,
      changePct: 0,
      direction: 'flat',
    };
  }

  if (safePrevious === 0 && safeCurrent > 0) {
    return {
      current: safeCurrent,
      previous: safePrevious,
      changePct: 100,
      direction: 'up',
    };
  }

  const rawChange = ((safeCurrent - safePrevious) / safePrevious) * 100;
  const changePct = Number(rawChange.toFixed(2));

  let direction: TrendDirection = 'flat';
  if (changePct > 0) direction = 'up';
  if (changePct < 0) direction = 'down';

  return {
    current: safeCurrent,
    previous: safePrevious,
    changePct,
    direction,
  };
}

function toKpi(current: number, previous: number): DashboardKpiDto {
  return {
    value: sanitizeNumber(current),
    trend: toTrend(current, previous),
    momChangePct: null,
  };
}

export function mapSubmissionsOverview(
  raw: SubmissionsOverviewRawAggregates,
): SubmissionsOverviewDto {
  const avgSubmitTime = raw.kpis.avgSubmitTime7d;
  const errorRate = raw.kpis.errorRate7d;

  return {
    period: raw.period,
    kpis: {
      submissions7d: toKpi(raw.kpis.submissions7d.current, raw.kpis.submissions7d.previous),
      conversion7d: toKpi(raw.kpis.conversion7d.current, raw.kpis.conversion7d.previous),
      ...(avgSubmitTime && avgSubmitTime.current !== null
        ? {
            avgSubmitTime7d: toKpi(
              avgSubmitTime.current,
              avgSubmitTime.previous ?? avgSubmitTime.current,
            ),
          }
        : {}),
      ...(errorRate
        ? {
            errorRate7d: toKpi(errorRate.current, errorRate.previous),
          }
        : {}),
    },
    funnel: {
      modalOpen: sanitizeNumber(raw.funnel.modalOpen),
      submitAttempt: sanitizeNumber(raw.funnel.submitAttempt),
      submitSuccess: sanitizeNumber(raw.funnel.submitSuccess),
      conversionRate: sanitizeNumber(raw.funnel.conversionRate),
      dropOffRate: sanitizeNumber(raw.funnel.dropOffRate),
    },
    charts: {
      submissionsTrend: raw.charts.submissionsTrend.map((point) => ({
        label: point.label,
        value: sanitizeNumber(point.value),
      })),
      errorsTrend: raw.charts.errorsTrend.map((point) => ({
        label: point.label,
        success: sanitizeNumber(point.success),
        error: sanitizeNumber(point.error),
      })),
    },
  };
}
