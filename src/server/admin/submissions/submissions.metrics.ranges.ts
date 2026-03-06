import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';
import {
  addDays,
  getCurrentYearMonthRanges,
  getDayRanges,
  getRangeFromDays,
  toIsoDate,
} from '@/server/admin/dashboard/dashboard.repository.core';
import type { SubmissionsOverviewPeriod, TrendBucket } from '@/server/admin/submissions/submissions.metrics.types';

function toDayLabel(date: Date): string {
  return toIsoDate(date).slice(5);
}

export function resolveSubmissionsPeriodBuckets(
  todayStart: Date,
  period: SubmissionsOverviewPeriod,
): {
  funnelRange: DateRange;
  buckets: TrendBucket[];
} {
  const tomorrowStart = addDays(todayStart, 1);

  if (period === 'week') {
    const dayRanges = getDayRanges(todayStart, 7);
    return {
      funnelRange: getRangeFromDays(todayStart, 7, 0),
      buckets: dayRanges.map((range) => ({
        label: toDayLabel(range.start),
        range,
      })),
    };
  }

  if (period === 'month') {
    const daysInCurrentMonth = todayStart.getUTCDate();
    const dayRanges = getDayRanges(todayStart, daysInCurrentMonth);
    const monthStart = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), 1));

    return {
      funnelRange: {
        start: monthStart,
        end: tomorrowStart,
      },
      buckets: dayRanges.map((range) => ({
        label: toDayLabel(range.start),
        range,
      })),
    };
  }

  const monthRanges = getCurrentYearMonthRanges(todayStart)
    .filter(({ range }) => range.start < tomorrowStart)
    .map(({ month, range }) => {
      const end = range.end < tomorrowStart ? range.end : tomorrowStart;
      return {
        label: month,
        range: {
          start: range.start,
          end,
        },
      };
    });

  return {
    funnelRange: {
      start: new Date(Date.UTC(todayStart.getUTCFullYear(), 0, 1)),
      end: tomorrowStart,
    },
    buckets: monthRanges,
  };
}
