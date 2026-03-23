import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';
import {
  addDays,
  getCurrentYearMonthRanges,
  getDayRangesFrom,
  toIsoDate,
} from '@/server/admin/dashboard/dashboard.repository.core';
import {
  getAdminDaysInMonth,
  startOfAdminMonth,
  startOfAdminWeek,
  startOfAdminYear,
} from '@/shared/time/europeKiev';
import type { SubmissionsOverviewPeriod, TrendBucket } from '@/server/admin/submissions/submissions.metrics.types';

function toDayLabel(date: Date): string {
  return toIsoDate(date).slice(8);
}

export function resolveSubmissionsPeriodBuckets(
  todayStart: Date,
  period: SubmissionsOverviewPeriod,
): {
  funnelRange: DateRange;
  buckets: TrendBucket[];
} {
  if (period === 'week') {
    const weekStart = startOfAdminWeek(todayStart);
    const dayRanges = getDayRangesFrom(weekStart, 7);
    return {
      funnelRange: {
        start: weekStart,
        end: addDays(weekStart, 7),
      },
      buckets: dayRanges.map((range) => ({
        label: toDayLabel(range.start),
        range,
      })),
    };
  }

  if (period === 'month') {
    const dayRanges = getDayRangesFrom(startOfAdminMonth(todayStart), getAdminDaysInMonth(todayStart));
    const monthStart = startOfAdminMonth(todayStart);

    return {
      funnelRange: {
        start: monthStart,
        end: addDays(dayRanges[dayRanges.length - 1]!.start, 1),
      },
      buckets: dayRanges.map((range) => ({
        label: toDayLabel(range.start),
        range,
      })),
    };
  }

  const monthRanges = getCurrentYearMonthRanges(todayStart).map(({ month, range }) => ({
    label: month,
    range,
  }));

  return {
    funnelRange: {
      start: startOfAdminYear(todayStart),
      end: monthRanges[monthRanges.length - 1]!.range.end,
    },
    buckets: monthRanges,
  };
}
