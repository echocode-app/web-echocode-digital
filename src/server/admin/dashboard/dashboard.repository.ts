import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import type {
  DashboardRawAggregates,
  LeadDistributionDto,
} from '@/server/admin/dashboard/dashboard.types';
import {
  addDays,
  countAnalyticsEventInRange,
  countVacancyLeadsInRange,
  getCurrentYearMonthRanges,
  getDayRanges,
  getLeadDistributionYearMonthly,
  getProjectLeadsByDay,
  getRangeFromDays,
  getSubmissionsTrend,
  getTrafficAndLeadsSeries,
  normalizeSafeNumber,
  pctChange,
  percentage,
  readCount,
  startOfUtcDay,
} from '@/server/admin/dashboard/dashboard.repository.core';
import {
  getSourcePerformance,
  getTopPortfolioItem,
  getTopVacancies,
} from '@/server/admin/dashboard/dashboard.repository.entities';
import {
  buildAlerts,
  buildFunnel,
  buildLeadVelocity,
  buildTrafficQualityInsight,
  getWeekdayInsights,
} from '@/server/admin/dashboard/dashboard.repository.insights';

type DateRange = {
  start: Date;
  end: Date;
};

async function countAdminActionsInRange(
  actionType: 'vacancies.manage' | 'portfolio.manage',
  range: DateRange,
): Promise<number> {
  const firestore = getFirestoreDb();
  const query = firestore
    .collection('admin_logs')
    .where('actionType', '==', actionType)
    .where('timestamp', '>=', Timestamp.fromDate(range.start))
    .where('timestamp', '<', Timestamp.fromDate(range.end));

  return readCount(query, `Failed to count admin logs for ${actionType}`);
}

export async function getDashboardRawAggregates(): Promise<DashboardRawAggregates> {
  const firestore = getFirestoreDb();

  // All windows are UTC-based to keep stable daily boundaries across environments.
  const todayStart = startOfUtcDay(new Date());
  const currentYearStart = new Date(Date.UTC(todayStart.getUTCFullYear(), 0, 1));
  const currentMonthStart = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), 1));
  const last7Days = getRangeFromDays(todayStart, 7, 0);
  const previous7Days = getRangeFromDays(todayStart, 7, 7);
  const last30Days = getRangeFromDays(todayStart, 30, 0);
  const previous30Days = getRangeFromDays(todayStart, 30, 30);
  const currentMonthRange: DateRange = {
    start: currentMonthStart,
    end: addDays(todayStart, 1),
  };
  const currentYearRange: DateRange = {
    start: currentYearStart,
    end: addDays(todayStart, 1),
  };
  const dayRangesCurrentMonth = getDayRanges(todayStart, todayStart.getUTCDate());
  const monthRangesYear = getCurrentYearMonthRanges(todayStart);

  const submissionsTotalQuery = firestore.collection('submissions');
  const clientSubmissionsTotalQuery = firestore.collection('client_submissions');
  const activeVacanciesQuery = firestore.collection('vacancies').where('isPublished', '==', true);
  const portfolioTotalQuery = firestore.collection('portfolio');

  const submissionsLast7Query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(last7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last7Days.end));
  const clientSubmissionsLast7Query = firestore
    .collection('client_submissions')
    .where('createdAt', '>=', Timestamp.fromDate(last7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last7Days.end));

  const submissionsPrev7Query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(previous7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous7Days.end));
  const clientSubmissionsPrev7Query = firestore
    .collection('client_submissions')
    .where('createdAt', '>=', Timestamp.fromDate(previous7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous7Days.end));

  const submissionsLast30Query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(last30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last30Days.end));
  const clientSubmissionsLast30Query = firestore
    .collection('client_submissions')
    .where('createdAt', '>=', Timestamp.fromDate(last30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last30Days.end));

  const submissionsPrev30Query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(previous30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous30Days.end));
  const clientSubmissionsPrev30Query = firestore
    .collection('client_submissions')
    .where('createdAt', '>=', Timestamp.fromDate(previous30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous30Days.end));

  const vacanciesLast7Query = firestore
    .collection('vacancies')
    .where('createdAt', '>=', Timestamp.fromDate(last7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last7Days.end))
    .where('isPublished', '==', true);

  const vacanciesPrev7Query = firestore
    .collection('vacancies')
    .where('createdAt', '>=', Timestamp.fromDate(previous7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous7Days.end))
    .where('isPublished', '==', true);

  const vacanciesLast30Query = firestore
    .collection('vacancies')
    .where('createdAt', '>=', Timestamp.fromDate(last30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last30Days.end))
    .where('isPublished', '==', true);

  const vacanciesPrev30Query = firestore
    .collection('vacancies')
    .where('createdAt', '>=', Timestamp.fromDate(previous30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous30Days.end))
    .where('isPublished', '==', true);

  const portfolioLast7Query = firestore
    .collection('portfolio')
    .where('createdAt', '>=', Timestamp.fromDate(last7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last7Days.end));

  const portfolioPrev7Query = firestore
    .collection('portfolio')
    .where('createdAt', '>=', Timestamp.fromDate(previous7Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous7Days.end));

  const portfolioLast30Query = firestore
    .collection('portfolio')
    .where('createdAt', '>=', Timestamp.fromDate(last30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(last30Days.end));

  const portfolioPrev30Query = firestore
    .collection('portfolio')
    .where('createdAt', '>=', Timestamp.fromDate(previous30Days.start))
    .where('createdAt', '<', Timestamp.fromDate(previous30Days.end));

  const [
    totalSubmissions,
    clientSubmissionsTotal,
    activeVacancies,
    portfolioItems,
    totalSubmissionsLast7,
    clientSubmissionsLast7,
    totalSubmissionsPrev7,
    clientSubmissionsPrev7,
    totalSubmissionsLast30,
    clientSubmissionsLast30,
    totalSubmissionsPrev30,
    clientSubmissionsPrev30,
    activeVacanciesLast7,
    activeVacanciesPrev7,
    activeVacanciesLast30,
    activeVacanciesPrev30,
    portfolioItemsLast7,
    portfolioItemsPrev7,
    portfolioItemsLast30,
    portfolioItemsPrev30,
    vacancyActionsLast7,
    vacancyActionsPrev7,
    vacancyActionsLast30,
    vacancyActionsPrev30,
    portfolioActionsLast7,
    portfolioActionsPrev7,
    portfolioActionsLast30,
    portfolioActionsPrev30,
    projectLeadsCurrent,
    projectLeadsPrevious,
    projectLeadsLast30,
    projectLeadsPrev30,
    vacancyLeadsCurrent,
    vacancyLeadsPrevious,
    vacancyLeadsLast30,
    vacancyLeadsPrev30,
    projectLeadsYear,
    vacancyLeadsYear,
    pageViewsCurrent,
    pageViewsPrevious,
    pageViewsLast30,
    pageViewsPrev30,
    submissionsTrend,
    trafficVsLeads,
    projectLeadsByDay,
    leadDistributionYearMonthly,
    topVacancies,
    sources,
    topPortfolio,
  ] = await Promise.all([
    readCount(submissionsTotalQuery, 'Failed to count total submissions'),
    readCount(clientSubmissionsTotalQuery, 'Failed to count total client submissions'),
    readCount(activeVacanciesQuery, 'Failed to count active vacancies'),
    readCount(portfolioTotalQuery, 'Failed to count portfolio items'),
    readCount(submissionsLast7Query, 'Failed to count submissions for last 7 days'),
    readCount(clientSubmissionsLast7Query, 'Failed to count client submissions for last 7 days'),
    readCount(submissionsPrev7Query, 'Failed to count submissions for previous 7 days'),
    readCount(clientSubmissionsPrev7Query, 'Failed to count client submissions for previous 7 days'),
    readCount(submissionsLast30Query, 'Failed to count submissions for last 30 days'),
    readCount(clientSubmissionsLast30Query, 'Failed to count client submissions for last 30 days'),
    readCount(submissionsPrev30Query, 'Failed to count submissions for previous 30 days'),
    readCount(clientSubmissionsPrev30Query, 'Failed to count client submissions for previous 30 days'),
    readCount(vacanciesLast7Query, 'Failed to count active vacancies for last 7 days'),
    readCount(vacanciesPrev7Query, 'Failed to count active vacancies for previous 7 days'),
    readCount(vacanciesLast30Query, 'Failed to count active vacancies for last 30 days'),
    readCount(vacanciesPrev30Query, 'Failed to count active vacancies for previous 30 days'),
    readCount(portfolioLast7Query, 'Failed to count portfolio items for last 7 days'),
    readCount(portfolioPrev7Query, 'Failed to count portfolio items for previous 7 days'),
    readCount(portfolioLast30Query, 'Failed to count portfolio items for last 30 days'),
    readCount(portfolioPrev30Query, 'Failed to count portfolio items for previous 30 days'),
    countAdminActionsInRange('vacancies.manage', last7Days),
    countAdminActionsInRange('vacancies.manage', previous7Days),
    countAdminActionsInRange('vacancies.manage', last30Days),
    countAdminActionsInRange('vacancies.manage', previous30Days),
    countAdminActionsInRange('portfolio.manage', last7Days),
    countAdminActionsInRange('portfolio.manage', previous7Days),
    countAdminActionsInRange('portfolio.manage', last30Days),
    countAdminActionsInRange('portfolio.manage', previous30Days),
    countAnalyticsEventInRange('submit_project', last7Days),
    countAnalyticsEventInRange('submit_project', previous7Days),
    countAnalyticsEventInRange('submit_project', last30Days),
    countAnalyticsEventInRange('submit_project', previous30Days),
    countVacancyLeadsInRange(last7Days),
    countVacancyLeadsInRange(previous7Days),
    countVacancyLeadsInRange(last30Days),
    countVacancyLeadsInRange(previous30Days),
    countAnalyticsEventInRange('submit_project', currentYearRange),
    countVacancyLeadsInRange(currentYearRange),
    countAnalyticsEventInRange('page_view', last7Days),
    countAnalyticsEventInRange('page_view', previous7Days),
    countAnalyticsEventInRange('page_view', last30Days),
    countAnalyticsEventInRange('page_view', previous30Days),
    getSubmissionsTrend(dayRangesCurrentMonth),
    getTrafficAndLeadsSeries(dayRangesCurrentMonth),
    getProjectLeadsByDay(dayRangesCurrentMonth),
    getLeadDistributionYearMonthly(monthRangesYear),
    getTopVacancies(currentMonthRange),
    getSourcePerformance(last30Days),
    getTopPortfolioItem(last30Days),
  ]);

  const leadDistribution: LeadDistributionDto = {
    project: normalizeSafeNumber(projectLeadsLast30),
    vacancy: normalizeSafeNumber(vacancyLeadsLast30),
  };

  const leadDistributionYear: LeadDistributionDto = {
    project: normalizeSafeNumber(projectLeadsYear),
    vacancy: normalizeSafeNumber(vacancyLeadsYear),
  };

  const conversionCurrent = percentage(projectLeadsCurrent, pageViewsCurrent);
  const conversionPrevious = percentage(projectLeadsPrevious, pageViewsPrevious);

  // Keep MoM conversion semantics consistent with KPI: project submits vs page views.
  const conversionLast30 = percentage(projectLeadsLast30, pageViewsLast30);
  const conversionPrev30 = percentage(projectLeadsPrev30, pageViewsPrev30);

  const activeVacanciesCurrentWoW = normalizeSafeNumber(Math.max(activeVacanciesLast7, vacancyActionsLast7));
  const activeVacanciesPreviousWoW = normalizeSafeNumber(Math.max(activeVacanciesPrev7, vacancyActionsPrev7));

  const portfolioItemsCurrentWoW = normalizeSafeNumber(Math.max(portfolioItemsLast7, portfolioActionsLast7));
  const portfolioItemsPreviousWoW = normalizeSafeNumber(Math.max(portfolioItemsPrev7, portfolioActionsPrev7));

  const activeVacanciesCurrentMoM = normalizeSafeNumber(Math.max(activeVacanciesLast30, vacancyActionsLast30));
  const activeVacanciesPreviousMoM = normalizeSafeNumber(Math.max(activeVacanciesPrev30, vacancyActionsPrev30));

  const portfolioItemsCurrentMoM = normalizeSafeNumber(Math.max(portfolioItemsLast30, portfolioActionsLast30));
  const portfolioItemsPreviousMoM = normalizeSafeNumber(Math.max(portfolioItemsPrev30, portfolioActionsPrev30));

  const funnel = buildFunnel(pageViewsLast30, projectLeadsLast30, vacancyLeadsLast30);
  const weekdayInsights = getWeekdayInsights(dayRangesCurrentMonth, projectLeadsByDay, trafficVsLeads);

  const topVacancy = topVacancies[0] ?? {
    label: 'No data',
    applications: 0,
  };

  const leadQualityRatio = percentage(projectLeadsLast30, projectLeadsLast30 + vacancyLeadsLast30);
  const leadVelocity = buildLeadVelocity(
    projectLeadsCurrent,
    vacancyLeadsCurrent,
    projectLeadsLast30,
    vacancyLeadsLast30,
  );
  const trafficQualityInsight = buildTrafficQualityInsight(trafficVsLeads);
  const topSourceSharePct = sources[0]?.share ?? 0;

  const growthVelocityMoM = pctChange(
    projectLeadsLast30 + vacancyLeadsLast30,
    projectLeadsPrev30 + vacancyLeadsPrev30,
  );

  const conversionDropOffPct = conversionLast30 >= conversionPrev30
    ? 0
    : Number((conversionPrev30 - conversionLast30).toFixed(2));

  const alerts = buildAlerts({
    trafficWowPct: pctChange(pageViewsCurrent, pageViewsPrevious),
    conversionWowPct: pctChange(conversionCurrent, conversionPrevious),
    leadWowPct: pctChange(projectLeadsCurrent, projectLeadsPrevious),
    vacancyLeadsWowPct: pctChange(vacancyLeadsCurrent, vacancyLeadsPrevious),
    topSourceSharePct,
  });

  return {
    totals: {
      totalSubmissions: normalizeSafeNumber(totalSubmissions + clientSubmissionsTotal),
      projectLeads: normalizeSafeNumber(projectLeadsCurrent),
      vacancyLeads: normalizeSafeNumber(vacancyLeadsCurrent),
      activeVacancies: normalizeSafeNumber(activeVacancies),
      portfolioItems: normalizeSafeNumber(portfolioItems),
      conversionRate7d: conversionCurrent,
    },
    windows: {
      totalSubmissions: {
        current: normalizeSafeNumber(totalSubmissionsLast7 + clientSubmissionsLast7),
        previous: normalizeSafeNumber(totalSubmissionsPrev7 + clientSubmissionsPrev7),
      },
      projectLeads: {
        current: normalizeSafeNumber(projectLeadsCurrent),
        previous: normalizeSafeNumber(projectLeadsPrevious),
      },
      vacancyLeads: {
        current: normalizeSafeNumber(vacancyLeadsCurrent),
        previous: normalizeSafeNumber(vacancyLeadsPrevious),
      },
      activeVacancies: {
        current: activeVacanciesCurrentWoW,
        previous: activeVacanciesPreviousWoW,
      },
      portfolioItems: {
        current: portfolioItemsCurrentWoW,
        previous: portfolioItemsPreviousWoW,
      },
      conversionRate7d: {
        current: conversionCurrent,
        previous: conversionPrevious,
      },
    },
    windowsMoM: {
      totalSubmissions: {
        current: normalizeSafeNumber(totalSubmissionsLast30 + clientSubmissionsLast30),
        previous: normalizeSafeNumber(totalSubmissionsPrev30 + clientSubmissionsPrev30),
      },
      projectLeads: {
        current: normalizeSafeNumber(projectLeadsLast30),
        previous: normalizeSafeNumber(projectLeadsPrev30),
      },
      vacancyLeads: {
        current: normalizeSafeNumber(vacancyLeadsLast30),
        previous: normalizeSafeNumber(vacancyLeadsPrev30),
      },
      activeVacancies: {
        current: activeVacanciesCurrentMoM,
        previous: activeVacanciesPreviousMoM,
      },
      portfolioItems: {
        current: portfolioItemsCurrentMoM,
        previous: portfolioItemsPreviousMoM,
      },
      conversionRate7d: {
        current: conversionLast30,
        previous: conversionPrev30,
      },
    },
    derived: {
      alerts,
      funnel,
      sources,
      leadVelocity,
      trafficQualityInsight,
      leadQualityRatio,
      bestDay: weekdayInsights.bestDay,
      bestDayShare: weekdayInsights.bestDayShare,
      bestDayTrafficDeltaPct: weekdayInsights.bestDayTrafficDeltaPct,
      topPortfolioItem: topPortfolio.title,
      topPortfolioViews: topPortfolio.views,
      topVacancyItem: topVacancy.label,
      topVacancyApplications: normalizeSafeNumber(topVacancy.applications),
      growthVelocityMoM,
      conversionDropOffPct,
    },
    charts: {
      submissionsTrend,
      leadDistribution,
      leadDistributionYear,
      leadDistributionYearMonthly,
      topVacancies,
      trafficVsLeads,
    },
  };
}
