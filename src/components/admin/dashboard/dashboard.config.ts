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
  submissions: 'Daily submission volume for the current month (from day 1 to today).',
  leadDistribution:
    'Monthly segmented distribution of project and vacancy leads for the current year.',
  leadDistributionYear:
    'Distribution of leads between project inquiries and vacancy-related submissions for the current year to date.',
  topVacancies:
    'Job positions ranked by number of applications in the current month.',
  trafficVsLeads:
    'Daily comparison between website traffic and total leads for the current month.',
  actions: 'Quick access to the most important administrative workflows.',
} as const;
