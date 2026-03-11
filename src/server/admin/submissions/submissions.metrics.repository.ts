import {
  countAnalyticsEventInRange,
  getRangeFromDays,
  normalizeSafeNumber,
  percentage,
  startOfUtcDay,
} from '@/server/admin/dashboard/dashboard.repository.core';
import {
  MODAL_OPEN_EVENT_TYPES,
  SUBMIT_ATTEMPT_EVENT_TYPES,
  SUBMIT_ERROR_EVENT_TYPES,
} from '@/server/admin/submissions/submissions.metrics.constants';
import { buildFunnelSnapshot } from '@/server/admin/submissions/submissions.metrics.calculations';
import {
  computeAverageSubmitTimeMinutes,
  countAnyAnalyticsEventInRange,
  countScopedSubmissionsInRange,
} from '@/server/admin/submissions/submissions.metrics.queries';
import { resolveSubmissionsPeriodBuckets } from '@/server/admin/submissions/submissions.metrics.ranges';
import type {
  ErrorsTrendPointRaw,
  SubmissionsOverviewPeriod,
  SubmissionsOverviewRawAggregates,
  SubmissionsTrendPointRaw,
} from '@/server/admin/submissions/submissions.metrics.types';

export type { SubmissionsOverviewRawAggregates } from '@/server/admin/submissions/submissions.metrics.types';

const MAIN_SITE_ID = 'echocode_digital' as const;

export async function getSubmissionsOverviewRawAggregates(
  period: SubmissionsOverviewPeriod = 'week',
): Promise<SubmissionsOverviewRawAggregates> {
  const todayStart = startOfUtcDay(new Date());
  const last7Days = getRangeFromDays(todayStart, 7, 0);
  const previous7Days = getRangeFromDays(todayStart, 7, 7);
  const periodConfig = resolveSubmissionsPeriodBuckets(todayStart, period);

  const [
    submissionsCurrent7,
    submissionsPrevious7,
    pageViewsCurrent7,
    pageViewsPrevious7,
    submitErrorCurrent7,
    submitErrorPrevious7,
    submitAttemptCurrent7,
    submitAttemptPrevious7,
    avgSubmitTimeCurrent7,
    avgSubmitTimePrevious7,
    modalOpenForPeriod,
    submitAttemptForPeriod,
    submitSuccessForPeriod,
    submissionsTrendCounts,
    errorsTrendCounts,
  ] = await Promise.all([
    countScopedSubmissionsInRange(last7Days, { siteId: MAIN_SITE_ID }),
    countScopedSubmissionsInRange(previous7Days, { siteId: MAIN_SITE_ID }),
    countAnalyticsEventInRange('page_view', last7Days, { siteId: MAIN_SITE_ID }),
    countAnalyticsEventInRange('page_view', previous7Days, { siteId: MAIN_SITE_ID }),
    countAnyAnalyticsEventInRange(SUBMIT_ERROR_EVENT_TYPES, last7Days, { siteId: MAIN_SITE_ID }),
    countAnyAnalyticsEventInRange(SUBMIT_ERROR_EVENT_TYPES, previous7Days, { siteId: MAIN_SITE_ID }),
    countAnyAnalyticsEventInRange(SUBMIT_ATTEMPT_EVENT_TYPES, last7Days, { siteId: MAIN_SITE_ID }),
    countAnyAnalyticsEventInRange(SUBMIT_ATTEMPT_EVENT_TYPES, previous7Days, { siteId: MAIN_SITE_ID }),
    computeAverageSubmitTimeMinutes(last7Days, { siteId: MAIN_SITE_ID }),
    computeAverageSubmitTimeMinutes(previous7Days, { siteId: MAIN_SITE_ID }),
    countAnyAnalyticsEventInRange(MODAL_OPEN_EVENT_TYPES, periodConfig.funnelRange, { siteId: MAIN_SITE_ID }),
    countAnyAnalyticsEventInRange(SUBMIT_ATTEMPT_EVENT_TYPES, periodConfig.funnelRange, { siteId: MAIN_SITE_ID }),
    countScopedSubmissionsInRange(periodConfig.funnelRange, { siteId: MAIN_SITE_ID }),
    Promise.all(periodConfig.buckets.map(({ range }) => countScopedSubmissionsInRange(range, { siteId: MAIN_SITE_ID }))),
    Promise.all(
      periodConfig.buckets.map(({ range }) =>
        countAnyAnalyticsEventInRange(SUBMIT_ERROR_EVENT_TYPES, range, { siteId: MAIN_SITE_ID }),
      ),
    ),
  ]);

  const submissionsTrend: SubmissionsTrendPointRaw[] = periodConfig.buckets.map((entry, index) => ({
    date: entry.range.start.toISOString().slice(0, 10),
    label: entry.label,
    value: normalizeSafeNumber(submissionsTrendCounts[index] ?? 0),
  }));

  const errorsTrend: ErrorsTrendPointRaw[] = periodConfig.buckets.map((entry, index) => ({
    date: entry.range.start.toISOString().slice(0, 10),
    label: entry.label,
    success: normalizeSafeNumber(submissionsTrendCounts[index] ?? 0),
    error: normalizeSafeNumber(errorsTrendCounts[index] ?? 0),
  }));

  const conversionCurrent7 = percentage(submissionsCurrent7, pageViewsCurrent7);
  const conversionPrevious7 = percentage(submissionsPrevious7, pageViewsPrevious7);

  const hasErrorRateTracking =
    submitErrorCurrent7 > 0 ||
    submitErrorPrevious7 > 0 ||
    submitAttemptCurrent7 > 0 ||
    submitAttemptPrevious7 > 0;

  const funnel = buildFunnelSnapshot(
    normalizeSafeNumber(modalOpenForPeriod),
    normalizeSafeNumber(submitAttemptForPeriod),
    normalizeSafeNumber(submitSuccessForPeriod),
  );

  return {
    period,
    kpis: {
      submissions7d: {
        current: normalizeSafeNumber(submissionsCurrent7),
        previous: normalizeSafeNumber(submissionsPrevious7),
      },
      conversion7d: {
        current: conversionCurrent7,
        previous: conversionPrevious7,
      },
      ...(avgSubmitTimeCurrent7 !== null
        ? {
            avgSubmitTime7d: {
              current: avgSubmitTimeCurrent7,
              previous: avgSubmitTimePrevious7,
            },
          }
        : {}),
      ...(hasErrorRateTracking
        ? {
            errorRate7d: {
              current: percentage(submitErrorCurrent7, submitAttemptCurrent7),
              previous: percentage(submitErrorPrevious7, submitAttemptPrevious7),
            },
          }
        : {}),
    },
    funnel,
    charts: {
      submissionsTrend,
      errorsTrend,
    },
  };
}
