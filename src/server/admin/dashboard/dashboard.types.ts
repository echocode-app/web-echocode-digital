export type TrendDirection = 'up' | 'down' | 'flat';

export type TrendStats = {
  current: number;
  previous: number;
  changePct: number;
  direction: TrendDirection;
};

export type DashboardKpiKey =
  | 'totalSubmissions'
  | 'projectLeads'
  | 'vacancyLeads'
  | 'activeVacancies'
  | 'portfolioItems'
  | 'conversionRate7d';

export type DashboardKpiDto = {
  value: number;
  trend: TrendStats;
  momChangePct: number | null;
};

export type SubmissionsTrendPointDto = {
  date: string;
  submissions: number;
};

export type LeadDistributionDto = {
  project: number;
  vacancy: number;
};

export type LeadDistributionMonthPointDto = {
  month: string;
  project: number;
  vacancy: number;
};

export type TopVacancyPointDto = {
  vacancyId: string;
  label: string;
  applications: number;
};

export type TrafficVsLeadsPointDto = {
  date: string;
  traffic: number;
  leads: number;
};

export type AlertDto = {
  id: string;
  level: 'warning' | 'alert' | 'anomaly' | 'volatility';
  message: string;
};

export type FunnelDto = {
  pageViews: number;
  projectLeads: number;
  vacancyLeads: number;
  totalLeads: number;
  conversionPct: number;
  leadToTrafficRatio: number;
  dropOffPct: number;
  projectLeadMixPct: number;
  vacancyLeadMixPct: number;
};

export type SourcePerformanceDto = {
  source: string;
  leads: number;
  share: number;
  conversionRate?: number;
};

export type LeadVelocityDto = {
  leadsLast7Days: number;
  leadsLast30Days: number;
  averageDaily7d: number;
  averageDaily30d: number;
  velocityRatio: number;
  direction: 'accelerating' | 'slowing' | 'stable';
};

export type TrafficQualityInsightDto = {
  conversionTrendSlope7d: number;
  trafficTrendPct7d: number;
  conversionTrendPct7d: number;
  warning: boolean;
  message: string | null;
};

export type DashboardOverviewDto = {
  kpis: Record<DashboardKpiKey, DashboardKpiDto>;
  charts: {
    submissionsTrend: SubmissionsTrendPointDto[];
    leadDistribution: LeadDistributionDto;
    leadDistributionYear: LeadDistributionDto;
    leadDistributionYearMonthly: LeadDistributionMonthPointDto[];
    topVacancies: TopVacancyPointDto[];
    trafficVsLeads: TrafficVsLeadsPointDto[];
  };
  alerts: AlertDto[];
  funnel: FunnelDto;
  sources?: SourcePerformanceDto[];
  leadVelocity: LeadVelocityDto;
  trafficQualityInsight: TrafficQualityInsightDto;
  leadQualityRatio: number;
  bestDay: string;
  bestDayShare: number;
  bestDayTrafficDeltaPct: number;
  topPortfolioItem: string;
  topPortfolioViews: number;
  topVacancyItem: string;
  topVacancyApplications: number;
  growthVelocityMoM: number;
  conversionDropOffPct: number;
};

export type DashboardRawAggregates = {
  totals: {
    totalSubmissions: number;
    projectLeads: number;
    vacancyLeads: number;
    activeVacancies: number;
    portfolioItems: number;
    conversionRate7d: number;
  };
  windows: {
    totalSubmissions: Pick<TrendStats, 'current' | 'previous'>;
    projectLeads: Pick<TrendStats, 'current' | 'previous'>;
    vacancyLeads: Pick<TrendStats, 'current' | 'previous'>;
    activeVacancies: Pick<TrendStats, 'current' | 'previous'>;
    portfolioItems: Pick<TrendStats, 'current' | 'previous'>;
    conversionRate7d: Pick<TrendStats, 'current' | 'previous'>;
  };
  windowsMoM: {
    totalSubmissions: Pick<TrendStats, 'current' | 'previous'>;
    projectLeads: Pick<TrendStats, 'current' | 'previous'>;
    vacancyLeads: Pick<TrendStats, 'current' | 'previous'>;
    activeVacancies: Pick<TrendStats, 'current' | 'previous'>;
    portfolioItems: Pick<TrendStats, 'current' | 'previous'>;
    conversionRate7d: Pick<TrendStats, 'current' | 'previous'>;
  };
  derived: Omit<
    DashboardOverviewDto,
    'kpis' | 'charts'
  >;
  charts: DashboardOverviewDto['charts'];
};
