import type {
  DashboardKpiKey,
  DashboardOverviewDto,
  DashboardRawAggregates,
  TrendDirection,
  TrendStats,
} from '@/server/admin/dashboard/dashboard.types';

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Number(value.toFixed(2));
}

// Converts raw current/previous values into deterministic trend semantics.
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

// Returns null when MoM baseline is missing to avoid misleading infinity growth.
function mapMoMChange(current: number, previous: number): number | null {
  const safeCurrent = sanitizeNumber(current);
  const safePrevious = sanitizeNumber(previous);

  if (safePrevious === 0 && safeCurrent === 0) return 0;
  if (safePrevious === 0) return null;

  return Number((((safeCurrent - safePrevious) / safePrevious) * 100).toFixed(2));
}

function mapKpi(
  key: DashboardKpiKey,
  data: DashboardRawAggregates,
): DashboardOverviewDto['kpis'][DashboardKpiKey] {
  return {
    value: sanitizeNumber(data.totals[key]),
    trend: toTrend(data.windows[key].current, data.windows[key].previous),
    momChangePct: mapMoMChange(data.windowsMoM[key].current, data.windowsMoM[key].previous),
  };
}

export function mapDashboardOverview(raw: DashboardRawAggregates): DashboardOverviewDto {
  return {
    kpis: {
      totalSubmissions: mapKpi('totalSubmissions', raw),
      projectLeads: mapKpi('projectLeads', raw),
      vacancyLeads: mapKpi('vacancyLeads', raw),
      activeVacancies: mapKpi('activeVacancies', raw),
      portfolioItems: mapKpi('portfolioItems', raw),
      conversionRate7d: mapKpi('conversionRate7d', raw),
    },
    charts: {
      submissionsTrend: raw.charts.submissionsTrend.map((point) => ({
        date: point.date,
        submissions: sanitizeNumber(point.submissions),
      })),
      leadDistribution: {
        project: sanitizeNumber(raw.charts.leadDistribution.project),
        vacancy: sanitizeNumber(raw.charts.leadDistribution.vacancy),
      },
      leadDistributionYear: {
        project: sanitizeNumber(raw.charts.leadDistributionYear.project),
        vacancy: sanitizeNumber(raw.charts.leadDistributionYear.vacancy),
      },
      leadDistributionYearMonthly: raw.charts.leadDistributionYearMonthly.map((point) => ({
        month: point.month,
        project: sanitizeNumber(point.project),
        vacancy: sanitizeNumber(point.vacancy),
      })),
      topVacancies: raw.charts.topVacancies.map((item) => ({
        vacancyId: item.vacancyId,
        label: item.label,
        applications: sanitizeNumber(item.applications),
      })),
      trafficVsLeads: raw.charts.trafficVsLeads.map((point) => ({
        date: point.date,
        traffic: sanitizeNumber(point.traffic),
        leads: sanitizeNumber(point.leads),
      })),
    },
    alerts: raw.derived.alerts,
    funnel: {
      pageViews: sanitizeNumber(raw.derived.funnel.pageViews),
      projectLeads: sanitizeNumber(raw.derived.funnel.projectLeads),
      vacancyLeads: sanitizeNumber(raw.derived.funnel.vacancyLeads),
      totalLeads: sanitizeNumber(raw.derived.funnel.totalLeads),
      conversionPct: sanitizeNumber(raw.derived.funnel.conversionPct),
      leadToTrafficRatio: sanitizeNumber(raw.derived.funnel.leadToTrafficRatio),
      dropOffPct: sanitizeNumber(raw.derived.funnel.dropOffPct),
      projectLeadMixPct: sanitizeNumber(raw.derived.funnel.projectLeadMixPct),
      vacancyLeadMixPct: sanitizeNumber(raw.derived.funnel.vacancyLeadMixPct),
    },
    sources: (raw.derived.sources ?? []).map((source) => ({
      source: source.source,
      leads: sanitizeNumber(source.leads),
      share: sanitizeNumber(source.share),
      ...(typeof source.conversionRate === 'number'
        ? { conversionRate: sanitizeNumber(source.conversionRate) }
        : {}),
    })),
    leadVelocity: {
      leadsLast7Days: sanitizeNumber(raw.derived.leadVelocity.leadsLast7Days),
      leadsLast30Days: sanitizeNumber(raw.derived.leadVelocity.leadsLast30Days),
      averageDaily7d: sanitizeNumber(raw.derived.leadVelocity.averageDaily7d),
      averageDaily30d: sanitizeNumber(raw.derived.leadVelocity.averageDaily30d),
      velocityRatio: sanitizeNumber(raw.derived.leadVelocity.velocityRatio),
      direction: raw.derived.leadVelocity.direction,
    },
    trafficQualityInsight: {
      conversionTrendSlope7d: sanitizeNumber(raw.derived.trafficQualityInsight.conversionTrendSlope7d),
      trafficTrendPct7d: sanitizeNumber(raw.derived.trafficQualityInsight.trafficTrendPct7d),
      conversionTrendPct7d: sanitizeNumber(raw.derived.trafficQualityInsight.conversionTrendPct7d),
      warning: raw.derived.trafficQualityInsight.warning,
      message: raw.derived.trafficQualityInsight.message,
    },
    leadQualityRatio: sanitizeNumber(raw.derived.leadQualityRatio),
    bestDay: raw.derived.bestDay,
    bestDayShare: sanitizeNumber(raw.derived.bestDayShare),
    bestDayTrafficDeltaPct: raw.derived.bestDayTrafficDeltaPct,
    topPortfolioItem: raw.derived.topPortfolioItem,
    topPortfolioViews: sanitizeNumber(raw.derived.topPortfolioViews),
    topVacancyItem: raw.derived.topVacancyItem,
    topVacancyApplications: sanitizeNumber(raw.derived.topVacancyApplications),
    growthVelocityMoM: raw.derived.growthVelocityMoM,
    conversionDropOffPct: sanitizeNumber(raw.derived.conversionDropOffPct),
  };
}
