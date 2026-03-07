import type { DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';
import {
  addDays,
  getCurrentYearMonthRanges,
  getDayRanges,
  getDayRangesFrom,
  getRangeFromDays,
  startOfUtcDay,
  type DateRange,
} from '@/server/admin/dashboard/dashboard.repository.core';
import {
  getAdminDaysInMonth,
  startOfAdminMonth,
  startOfAdminWeek,
  startOfAdminYear,
} from '@/shared/time/europeKiev';

export type DashboardRepositoryRanges = {
  todayStart: Date;
  currentYearRange: DateRange;
  currentMonthRange: DateRange;
  last7Days: DateRange;
  previous7Days: DateRange;
  last30Days: DateRange;
  previous30Days: DateRange;
  dayRangesCurrentMonth: DateRange[];
  dayRangesCurrentMonthToDate: DateRange[];
  monthRangesYear: Array<{ month: string; range: DateRange }>;
  trafficVsLeadsRanges: DateRange[];
  trafficVsLeadsInsightRanges: DateRange[];
};

function resolveTrafficVsLeadsRanges(todayStart: Date, period: DashboardPeriod): DateRange[] {
  if (period === 'week') {
    return getDayRangesFrom(startOfAdminWeek(todayStart), 7);
  }

  if (period === 'month') {
    return getDayRangesFrom(startOfAdminMonth(todayStart), getAdminDaysInMonth(todayStart));
  }

  return getCurrentYearMonthRanges(todayStart).map(({ range }) => range);
}

function resolveTrafficVsLeadsInsightRanges(
  todayStart: Date,
  period: DashboardPeriod,
): DateRange[] {
  if (period === 'week') {
    return getDayRanges(todayStart, 7);
  }

  if (period === 'month') {
    return getDayRanges(todayStart, todayStart.getUTCDate());
  }

  const tomorrowStart = addDays(todayStart, 1);
  return getCurrentYearMonthRanges(todayStart)
    .filter(({ range }) => range.start < tomorrowStart)
    .map(({ range }) => ({
      start: range.start,
      end: range.end < tomorrowStart ? range.end : tomorrowStart,
    }));
}

// Builds all UTC-stable time windows used by dashboard aggregates.
export function buildDashboardRepositoryRanges(period: DashboardPeriod): DashboardRepositoryRanges {
  const todayStart = startOfUtcDay(new Date());
  const currentYearStart = startOfAdminYear(todayStart);
  const currentMonthStart = startOfAdminMonth(todayStart);

  const currentYearRange: DateRange = {
    start: currentYearStart,
    end: addDays(todayStart, 1),
  };

  return {
    todayStart,
    currentYearRange,
    currentMonthRange: {
      start: currentMonthStart,
      end: addDays(todayStart, 1),
    },
    last7Days: getRangeFromDays(todayStart, 7, 0),
    previous7Days: getRangeFromDays(todayStart, 7, 7),
    last30Days: getRangeFromDays(todayStart, 30, 0),
    previous30Days: getRangeFromDays(todayStart, 30, 30),
    dayRangesCurrentMonth: getDayRangesFrom(currentMonthStart, getAdminDaysInMonth(todayStart)),
    dayRangesCurrentMonthToDate: getDayRanges(todayStart, todayStart.getUTCDate()),
    monthRangesYear: getCurrentYearMonthRanges(todayStart),
    trafficVsLeadsRanges: resolveTrafficVsLeadsRanges(todayStart, period),
    trafficVsLeadsInsightRanges: resolveTrafficVsLeadsInsightRanges(todayStart, period),
  };
}
