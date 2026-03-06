import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';

export type SubmissionsOverviewPeriod = 'week' | 'month' | 'year';

export type TrendWindow = {
  current: number;
  previous: number;
};

export type DurationWindow = {
  current: number | null;
  previous: number | null;
};

export type FunnelRaw = {
  modalOpen: number;
  submitAttempt: number;
  submitSuccess: number;
  conversionRate: number;
  dropOffRate: number;
};

export type SubmissionsTrendPointRaw = {
  label: string;
  value: number;
};

export type ErrorsTrendPointRaw = {
  label: string;
  success: number;
  error: number;
};

export type TrendBucket = {
  label: string;
  range: DateRange;
};

export type SubmissionsOverviewRawAggregates = {
  period: SubmissionsOverviewPeriod;
  kpis: {
    submissions7d: TrendWindow;
    conversion7d: TrendWindow;
    avgSubmitTime7d?: DurationWindow;
    errorRate7d?: TrendWindow;
  };
  funnel: FunnelRaw;
  charts: {
    submissionsTrend: SubmissionsTrendPointRaw[];
    errorsTrend: ErrorsTrendPointRaw[];
  };
};
