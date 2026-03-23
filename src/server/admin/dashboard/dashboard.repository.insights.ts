import type {
  AlertDto,
  FunnelDto,
  LeadVelocityDto,
  TrafficQualityInsightDto,
  TrafficVsLeadsPointDto,
} from '@/server/admin/dashboard/dashboard.types';
import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';
import {
  normalizeSafeNumber,
  normalizeSafeRate,
  pctChange,
  percentage,
} from '@/server/admin/dashboard/dashboard.repository.core';

function weekdayName(day: number): string {
  return (
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day] ?? 'N/A'
  );
}

// Weekday insight based on project leads concentration and traffic delta.
export function getWeekdayInsights(
  dayRanges: DateRange[],
  projectLeadsByDay: number[],
  trafficVsLeads: TrafficVsLeadsPointDto[],
) {
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

  const bestDayTrafficDeltaPct =
    avgDailyTraffic <= 0
      ? 0
      : normalizeSafeRate(((bestDayTrafficAvg - avgDailyTraffic) / avgDailyTraffic) * 100);

  return {
    bestDay: weekdayName(bestWeekday),
    bestDayShare,
    bestDayTrafficDeltaPct,
  };
}

// Funnel snapshot keeps a compact executive ratio view.
export function buildFunnel(
  pageViews: number,
  projectLeads: number,
  vacancyLeads: number,
): FunnelDto {
  const totalLeads = normalizeSafeNumber(projectLeads + vacancyLeads);
  const conversionPct = percentage(totalLeads, pageViews);
  const leadToTrafficRatio = conversionPct;
  const dropOffPct =
    pageViews <= 0 ? 0 : normalizeSafeRate(((pageViews - totalLeads) / pageViews) * 100);

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

export function buildLeadVelocity(
  projectLeadsLast7: number,
  vacancyLeadsLast7: number,
  projectLeadsLast30: number,
  vacancyLeadsLast30: number,
): LeadVelocityDto {
  const leadsLast7Days = normalizeSafeNumber(projectLeadsLast7 + vacancyLeadsLast7);
  const leadsLast30Days = normalizeSafeNumber(projectLeadsLast30 + vacancyLeadsLast30);
  const averageDaily7d = normalizeSafeRate(leadsLast7Days / 7);
  const averageDaily30d = normalizeSafeRate(leadsLast30Days / 30);

  const velocityRatio =
    averageDaily30d > 0
      ? normalizeSafeRate(averageDaily7d / averageDaily30d)
      : averageDaily7d > 0
        ? 2
        : 1;

  let direction: LeadVelocityDto['direction'] = 'stable';
  if (velocityRatio > 1.15) direction = 'accelerating';
  if (velocityRatio < 0.85) direction = 'slowing';

  return {
    leadsLast7Days,
    leadsLast30Days,
    averageDaily7d,
    averageDaily30d,
    velocityRatio,
    direction,
  };
}

function dailyConversion(leads: number, traffic: number): number {
  if (traffic <= 0 || leads <= 0) return 0;
  return leads / traffic;
}

function computeSlope(values: number[]): number {
  if (values.length < 2) return 0;

  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((sum, value) => sum + value, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let index = 0; index < n; index += 1) {
    const xDiff = index - xMean;
    const yDiff = values[index] - yMean;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }

  if (denominator <= 0) return 0;
  return numerator / denominator;
}

export function buildTrafficQualityInsight(
  trafficVsLeads: TrafficVsLeadsPointDto[],
): TrafficQualityInsightDto {
  if (trafficVsLeads.length < 14) {
    return {
      conversionTrendSlope7d: 0,
      trafficTrendPct7d: 0,
      conversionTrendPct7d: 0,
      warning: false,
      message: null,
    };
  }

  const last14 = trafficVsLeads.slice(-14);
  const previous7 = last14.slice(0, 7);
  const current7 = last14.slice(7);

  const previousTraffic = previous7.reduce((sum, point) => sum + point.traffic, 0);
  const currentTraffic = current7.reduce((sum, point) => sum + point.traffic, 0);

  const previousLeads = previous7.reduce((sum, point) => sum + point.leads, 0);
  const currentLeads = current7.reduce((sum, point) => sum + point.leads, 0);

  const previousConversion = dailyConversion(previousLeads, previousTraffic);
  const currentConversion = dailyConversion(currentLeads, currentTraffic);

  const trafficTrendPct7d = pctChange(currentTraffic, previousTraffic);
  const conversionTrendPct7d = pctChange(currentConversion, previousConversion);

  const conversionSeriesLast7 = current7.map((point) =>
    dailyConversion(point.leads, point.traffic),
  );
  const conversionTrendSlope7d = normalizeSafeRate(computeSlope(conversionSeriesLast7) * 100);

  const warning = trafficTrendPct7d > 0 && conversionTrendPct7d < 0;
  const message = warning
    ? 'Traffic is rising while lead conversion is declining over the last week.'
    : null;

  return {
    conversionTrendSlope7d,
    trafficTrendPct7d,
    conversionTrendPct7d,
    warning,
    message,
  };
}

// Alert rules stay deterministic and threshold-driven by design.
export function buildAlerts(input: {
  trafficWowPct: number;
  conversionWowPct: number;
  leadWowPct: number;
  vacancyLeadsWowPct: number;
  topSourceSharePct: number;
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

  if (input.topSourceSharePct > 75) {
    alerts.push({
      id: 'source-concentration-high',
      level: 'alert',
      message: `Top source concentration is high at ${input.topSourceSharePct.toFixed(2)}%.`,
    });
  } else if (input.topSourceSharePct > 60) {
    alerts.push({
      id: 'source-concentration-medium',
      level: 'warning',
      message: `Top source concentration reached ${input.topSourceSharePct.toFixed(2)}%.`,
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
