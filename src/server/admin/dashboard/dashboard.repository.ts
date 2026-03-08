import { getFirestoreDb } from '@/server/firebase/firestore';
import type {
  DashboardPeriod,
  DashboardRawAggregates,
  LeadDistributionDto,
} from '@/server/admin/dashboard/dashboard.types';
import {
  countAnalyticsEventInRange,
  countVacancyLeadsInRange,
  getLeadDistributionYearMonthly,
  getProjectLeadsByDay,
  getSubmissionsTrend,
  getTrafficAndLeadsSeries,
  normalizeSafeNumber,
  pctChange,
  percentage,
  readCount,
} from '@/server/admin/dashboard/dashboard.repository.core';
import { buildDashboardCountQueries } from '@/server/admin/dashboard/dashboard.repository.queries';
import { buildDashboardRepositoryRanges } from '@/server/admin/dashboard/dashboard.repository.ranges';
import {
  getSourcePerformance,
  getTopPortfolioItem,
  getTopVacancies,
} from '@/server/admin/dashboard/dashboard.repository.entities';
import { countEffectiveActiveVacancies } from '@/server/vacancies';
import {
  buildAlerts,
  buildFunnel,
  buildLeadVelocity,
  buildTrafficQualityInsight,
  getWeekdayInsights,
} from '@/server/admin/dashboard/dashboard.repository.insights';

export async function getDashboardRawAggregates(
  period: DashboardPeriod = 'week',
): Promise<DashboardRawAggregates> {
  const firestore = getFirestoreDb();
  const ranges = buildDashboardRepositoryRanges(period);
  const queries = buildDashboardCountQueries(firestore, ranges);

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
    readCount(queries.submissionsTotalQuery, 'Failed to count total submissions'),
    readCount(queries.clientSubmissionsTotalQuery, 'Failed to count total client submissions'),
    countEffectiveActiveVacancies(),
    readCount(queries.portfolioTotalQuery, 'Failed to count portfolio items'),
    readCount(queries.submissionsLast7Query, 'Failed to count submissions for last 7 days'),
    readCount(
      queries.clientSubmissionsLast7Query,
      'Failed to count client submissions for last 7 days',
    ),
    readCount(queries.submissionsPrev7Query, 'Failed to count submissions for previous 7 days'),
    readCount(
      queries.clientSubmissionsPrev7Query,
      'Failed to count client submissions for previous 7 days',
    ),
    readCount(queries.submissionsLast30Query, 'Failed to count submissions for last 30 days'),
    readCount(
      queries.clientSubmissionsLast30Query,
      'Failed to count client submissions for last 30 days',
    ),
    readCount(queries.submissionsPrev30Query, 'Failed to count submissions for previous 30 days'),
    readCount(
      queries.clientSubmissionsPrev30Query,
      'Failed to count client submissions for previous 30 days',
    ),
    countAnalyticsEventInRange('submit_project', ranges.last7Days),
    countAnalyticsEventInRange('submit_project', ranges.previous7Days),
    countAnalyticsEventInRange('submit_project', ranges.last30Days),
    countAnalyticsEventInRange('submit_project', ranges.previous30Days),
    countVacancyLeadsInRange(ranges.last7Days),
    countVacancyLeadsInRange(ranges.previous7Days),
    countVacancyLeadsInRange(ranges.last30Days),
    countVacancyLeadsInRange(ranges.previous30Days),
    countAnalyticsEventInRange('submit_project', ranges.currentYearRange),
    countVacancyLeadsInRange(ranges.currentYearRange),
    countAnalyticsEventInRange('page_view', ranges.last7Days),
    countAnalyticsEventInRange('page_view', ranges.previous7Days),
    countAnalyticsEventInRange('page_view', ranges.last30Days),
    countAnalyticsEventInRange('page_view', ranges.previous30Days),
    getSubmissionsTrend(ranges.dayRangesCurrentMonth),
    getTrafficAndLeadsSeries(ranges.trafficVsLeadsRanges),
    getProjectLeadsByDay(ranges.dayRangesCurrentMonthToDate),
    getLeadDistributionYearMonthly(ranges.monthRangesYear),
    getTopVacancies(ranges.currentMonthRange),
    getSourcePerformance(ranges.last30Days),
    getTopPortfolioItem(ranges.last30Days),
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

  // Historical published-state diffs are not currently modeled, so we keep these KPI trends neutral
  // instead of deriving misleading movement from admin action volume.
  const activeVacanciesCurrentWoW = normalizeSafeNumber(activeVacancies);
  const activeVacanciesPreviousWoW = normalizeSafeNumber(activeVacancies);

  const portfolioItemsCurrentWoW = normalizeSafeNumber(portfolioItems);
  const portfolioItemsPreviousWoW = normalizeSafeNumber(portfolioItems);

  const activeVacanciesCurrentMoM = normalizeSafeNumber(activeVacancies);
  const activeVacanciesPreviousMoM = normalizeSafeNumber(activeVacancies);

  const portfolioItemsCurrentMoM = normalizeSafeNumber(portfolioItems);
  const portfolioItemsPreviousMoM = normalizeSafeNumber(portfolioItems);

  const funnel = buildFunnel(pageViewsLast30, projectLeadsLast30, vacancyLeadsLast30);
  const trafficVsLeadsForInsights = trafficVsLeads.slice(
    0,
    ranges.trafficVsLeadsInsightRanges.length,
  );
  const weekdayInsights = getWeekdayInsights(
    ranges.dayRangesCurrentMonthToDate,
    projectLeadsByDay,
    trafficVsLeadsForInsights,
  );

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
  const trafficQualityInsight = buildTrafficQualityInsight(trafficVsLeadsForInsights);
  const topSourceSharePct = sources[0]?.share ?? 0;

  const growthVelocityMoM = pctChange(
    projectLeadsLast30 + vacancyLeadsLast30,
    projectLeadsPrev30 + vacancyLeadsPrev30,
  );

  const conversionDropOffPct =
    conversionLast30 >= conversionPrev30
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
    trafficVsLeadsPeriod: period,
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
