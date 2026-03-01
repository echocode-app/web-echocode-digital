import type { DashboardKpiKey } from '@/server/admin/dashboard/dashboard.types';

export type KpiConfig = {
  metricKey: DashboardKpiKey;
  title: string;
};

export const KPI_CONFIG: KpiConfig[] = [
  { metricKey: 'totalSubmissions', title: 'Total submissions' },
  { metricKey: 'projectLeads', title: 'Project leads' },
  { metricKey: 'vacancyLeads', title: 'Vacancy leads' },
  { metricKey: 'activeVacancies', title: 'Active vacancies' },
  { metricKey: 'portfolioItems', title: 'Portfolio items' },
  { metricKey: 'conversionRate7d', title: '7d conversion rate' },
];

export const PANEL_INFO_TEXT = {
  submissions: 'Daily submission volume over the last 30 days. Helps identify growth trends and seasonal patterns.',
  leadDistribution:
    'Monthly segmented distribution of project and vacancy leads for the current year.',
  leadDistributionYear:
    'Distribution of leads between project inquiries and vacancy-related submissions for the current year to date.',
  topVacancies:
    'Job positions ranked by number of applications in the last 30 days. Identifies highest-demand roles.',
  trafficVsLeads:
    'Daily comparison between website traffic and total leads. Used to evaluate funnel efficiency and conversion behavior.',
  actions: 'Quick access to the most important administrative workflows.',
} as const;

export const DASHBOARD_MOCK_QUERY_KEY = 'mockDashboard';
