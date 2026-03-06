import type { DashboardKpiKey } from '@/server/admin/dashboard/dashboard.types';

export type KpiConfig = {
  metricKey: DashboardKpiKey;
  title: string;
};

export const KPI_CONFIG: KpiConfig[] = [
  { metricKey: 'totalSubmissions', title: 'Tracked submissions (core + client)' },
  { metricKey: 'projectLeads', title: 'Client project leads' },
  { metricKey: 'vacancyLeads', title: 'Vacancy candidate leads' },
  { metricKey: 'activeVacancies', title: 'Active vacancies' },
  { metricKey: 'portfolioItems', title: 'Portfolio items' },
  { metricKey: 'conversionRate7d', title: '7d project conversion rate' },
];

export const PANEL_INFO_TEXT = {
  submissions: 'Tracked submission volume across the selected reporting period for the moderation-backed submission queues.',
  leadDistribution:
    'Lead mix for the selected reporting period: client project leads versus vacancy candidate leads.',
  leadDistributionYear:
    'Year-to-date lead mix: client project inquiries versus vacancy candidate submissions.',
  topVacancies:
    'Vacancy positions ranked by candidate applications in the current month (submit_vacancy + apply_vacancy analytics events).',
  trafficVsLeads:
    'Comparison between website traffic and tracked leads for the selected reporting period: client project leads plus vacancy candidate leads.',
  actions: 'Quick access to the most important administrative workflows.',
} as const;
