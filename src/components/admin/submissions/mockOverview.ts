import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';

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

function getYearMonthsToDate(): string[] {
  const today = new Date();
  const currentMonth = today.getUTCMonth();

  return Array.from({ length: currentMonth + 1 }, (_, index) => String(index + 1).padStart(2, '0'));
}

const monthValues = [92, 104, 111, 99, 118, 126, 132, 137, 141, 149, 155, 44];
const successSeries = [
  12, 11, 13, 15, 14, 12, 16, 17, 18, 16,
  17, 19, 20, 18, 21, 22, 23, 21, 20, 22,
  24, 25, 23, 22, 24, 26, 27, 25, 24, 26,
];
const errorSeries = [
  1, 2, 1, 1, 0, 1, 2, 1, 1, 2,
  1, 2, 2, 1, 1, 2, 1, 2, 1, 1,
  2, 1, 2, 1, 1, 2, 1, 2, 1, 1,
];

const months = getYearMonthsToDate();
const dates30 = getLast30Dates();

export const SUBMISSIONS_OVERVIEW_MOCK: SubmissionsOverviewDto = {
  kpis: {
    submissions7d: {
      value: 48,
      trend: {
        current: 48,
        previous: 39,
        changePct: 23.08,
        direction: 'up',
      },
      momChangePct: null,
    },
    conversion7d: {
      value: 3.42,
      trend: {
        current: 3.42,
        previous: 2.91,
        changePct: 17.53,
        direction: 'up',
      },
      momChangePct: null,
    },
    avgSubmitTime7d: {
      value: 18.4,
      trend: {
        current: 18.4,
        previous: 21.7,
        changePct: -15.21,
        direction: 'down',
      },
      momChangePct: null,
    },
    errorRate7d: {
      value: 4.96,
      trend: {
        current: 4.96,
        previous: 6.11,
        changePct: -18.82,
        direction: 'down',
      },
      momChangePct: null,
    },
  },
  funnel: {
    modalOpen: 520,
    submitAttempt: 173,
    submitSuccess: 148,
    conversionRate: 28.46,
    dropOffRate: 71.54,
  },
  charts: {
    submissionsTrend30d: months.map((month, index) => ({
      month,
      value: monthValues[index] ?? monthValues[monthValues.length - 1],
    })),
    errorsTrend30d: dates30.map((date, index) => ({
      date,
      success: successSeries[index],
      error: errorSeries[index],
    })),
  },
};
