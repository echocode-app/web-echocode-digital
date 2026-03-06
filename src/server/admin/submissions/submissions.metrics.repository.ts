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
  countSubmissionsInRange,
} from '@/server/admin/submissions/submissions.metrics.queries';
import { resolveSubmissionsPeriodBuckets } from '@/server/admin/submissions/submissions.metrics.ranges';
import type {
  ErrorsTrendPointRaw,
  SubmissionsOverviewPeriod,
  SubmissionsOverviewRawAggregates,
  SubmissionsTrendPointRaw,
} from '@/server/admin/submissions/submissions.metrics.types';

export type { SubmissionsOverviewRawAggregates } from '@/server/admin/submissions/submissions.metrics.types';

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
    countSubmissionsInRange(last7Days),
    countSubmissionsInRange(previous7Days),
    countAnalyticsEventInRange('page_view', last7Days),
    countAnalyticsEventInRange('page_view', previous7Days),
    countAnyAnalyticsEventInRange(SUBMIT_ERROR_EVENT_TYPES, last7Days),
    countAnyAnalyticsEventInRange(SUBMIT_ERROR_EVENT_TYPES, previous7Days),
    countAnyAnalyticsEventInRange(SUBMIT_ATTEMPT_EVENT_TYPES, last7Days),
    countAnyAnalyticsEventInRange(SUBMIT_ATTEMPT_EVENT_TYPES, previous7Days),
    computeAverageSubmitTimeMinutes(last7Days),
    computeAverageSubmitTimeMinutes(previous7Days),
    countAnyAnalyticsEventInRange(MODAL_OPEN_EVENT_TYPES, periodConfig.funnelRange),
    countAnyAnalyticsEventInRange(SUBMIT_ATTEMPT_EVENT_TYPES, periodConfig.funnelRange),
    countSubmissionsInRange(periodConfig.funnelRange),
    Promise.all(periodConfig.buckets.map(({ range }) => countSubmissionsInRange(range))),
    Promise.all(periodConfig.buckets.map(({ range }) => countAnyAnalyticsEventInRange(SUBMIT_ERROR_EVENT_TYPES, range))),
  ]);

  const submissionsTrend: SubmissionsTrendPointRaw[] = periodConfig.buckets.map((entry, index) => ({
    label: entry.label,
    value: normalizeSafeNumber(submissionsTrendCounts[index] ?? 0),
  }));

  const errorsTrend: ErrorsTrendPointRaw[] = periodConfig.buckets.map((entry, index) => ({
    label: entry.label,
    success: normalizeSafeNumber(submissionsTrendCounts[index] ?? 0),
    error: normalizeSafeNumber(errorsTrendCounts[index] ?? 0),
  }));

  const conversionCurrent7 = percentage(submissionsCurrent7, pageViewsCurrent7);
  const conversionPrevious7 = percentage(submissionsPrevious7, pageViewsPrevious7);

  const hasErrorRateTracking =
    submitErrorCurrent7 > 0 || submitErrorPrevious7 > 0 || submitAttemptCurrent7 > 0 || submitAttemptPrevious7 > 0;

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
