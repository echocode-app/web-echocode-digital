import type { DashboardOverviewDto } from '@/server/admin/dashboard/dashboard.types';

const DAY_MS = 24 * 60 * 60 * 1000;

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getLast30Dates(): string[] {
  const today = new Date();
  const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  return Array.from({ length: 30 }, (_, index) => {
    const d = new Date(utcToday.getTime() - (29 - index) * DAY_MS);
    return toIsoDate(d);
  });
}

const dates = getLast30Dates();

const submissionsSeries = [
  12, 14, 10, 16, 15, 18, 17, 13, 11, 19,
  21, 18, 16, 20, 23, 25, 22, 24, 27, 26,
  29, 28, 31, 33, 30, 35, 34, 36, 39, 37,
];

const trafficSeries = [
  410, 430, 398, 445, 470, 520, 510, 480, 460, 530,
  560, 545, 538, 590, 610, 640, 620, 635, 660, 675,
  690, 705, 712, 730, 745, 760, 780, 795, 820, 840,
];

const leadsSeries = [
  24, 26, 23, 29, 30, 33, 31, 28, 27, 35,
  36, 34, 33, 39, 41, 43, 40, 42, 45, 44,
  47, 49, 50, 51, 53, 55, 56, 58, 60, 61,
];

export const DASHBOARD_OVERVIEW_MOCK: DashboardOverviewDto = {
  kpis: {
    totalSubmissions: {
      value: 1248,
      trend: {
        current: 167,
        previous: 138,
        changePct: 21.01,
        direction: 'up',
      },
      momChangePct: 18.24,
    },
    projectLeads: {
      value: 96,
      trend: {
        current: 96,
        previous: 82,
        changePct: 17.07,
        direction: 'up',
      },
      momChangePct: 14.3,
    },
    vacancyLeads: {
      value: 132,
      trend: {
        current: 132,
        previous: 146,
        changePct: -9.59,
        direction: 'down',
      },
      momChangePct: 8.12,
    },
    activeVacancies: {
      value: 18,
      trend: {
        current: 6,
        previous: 6,
        changePct: 0,
        direction: 'flat',
      },
      momChangePct: 5.56,
    },
    portfolioItems: {
      value: 42,
      trend: {
        current: 5,
        previous: 3,
        changePct: 66.67,
        direction: 'up',
      },
      momChangePct: 12.9,
    },
    conversionRate7d: {
      value: 3.87,
      trend: {
        current: 3.87,
        previous: 3.21,
        changePct: 20.56,
        direction: 'up',
      },
      momChangePct: 9.73,
    },
  },
  charts: {
    submissionsTrend: dates.map((date, index) => ({
      date,
      submissions: submissionsSeries[index],
    })),
    leadDistribution: {
      project: 396,
      vacancy: 522,
    },
    leadDistributionYear: {
      project: 1254,
      vacancy: 1718,
    },
    leadDistributionYearMonthly: [
      { month: '01', project: 102, vacancy: 136 },
      { month: '02', project: 94, vacancy: 121 },
      { month: '03', project: 110, vacancy: 148 },
      { month: '04', project: 98, vacancy: 142 },
      { month: '05', project: 106, vacancy: 151 },
      { month: '06', project: 115, vacancy: 167 },
      { month: '07', project: 120, vacancy: 171 },
      { month: '08', project: 127, vacancy: 180 },
      { month: '09', project: 134, vacancy: 193 },
      { month: '10', project: 142, vacancy: 204 },
      { month: '11', project: 152, vacancy: 225 },
      { month: '12', project: 54, vacancy: 80 },
    ],
    topVacancies: [
      { vacancyId: 'frontend-engineer', label: 'Frontend Engineer', applications: 94 },
      { vacancyId: 'qa-automation', label: 'QA Automation Engineer', applications: 81 },
      { vacancyId: 'product-designer', label: 'Product Designer', applications: 69 },
      { vacancyId: 'project-manager', label: 'Project Manager', applications: 57 },
      { vacancyId: 'backend-node', label: 'Backend Node.js Engineer', applications: 46 },
      { vacancyId: 'devops', label: 'DevOps Engineer', applications: 38 },
    ],
    trafficVsLeads: dates.map((date, index) => ({
      date,
      traffic: trafficSeries[index],
      leads: leadsSeries[index],
    })),
  },
  alerts: [
    { id: 'traffic-drop', level: 'warning', message: 'Traffic decreased 28.40% compared to last week.' },
    { id: 'lead-growth', level: 'anomaly', message: 'Project lead growth accelerated by 52.60%.' },
  ],
  funnel: {
    pageViews: 18342,
    projectLeads: 396,
    vacancyLeads: 522,
    totalLeads: 918,
    conversionPct: 5,
    leadToTrafficRatio: 5,
    dropOffPct: 95,
    projectLeadMixPct: 43.14,
    vacancyLeadMixPct: 56.86,
  },
  sources: [
    { source: 'google', leads: 251, conversionRate: 4.76 },
    { source: 'linkedin', leads: 188, conversionRate: 6.12 },
    { source: 'direct', leads: 143, conversionRate: 3.81 },
    { source: 'clutch', leads: 119, conversionRate: 7.24 },
    { source: 'upwork', leads: 82, conversionRate: 5.58 },
  ],
  leadQualityRatio: 43.14,
  bestDay: 'Wednesday',
  bestDayShare: 22.38,
  bestDayTrafficDeltaPct: 11.72,
  topPortfolioItem: 'FinTech Mobile Platform',
  topPortfolioViews: 764,
  topVacancyItem: 'Frontend Engineer',
  topVacancyApplications: 94,
  growthVelocityMoM: 14.2,
  conversionDropOffPct: 6.1,
};
