import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';
import {
  countAnalyticsEventInRange,
  getCurrentYearMonthRanges,
  getDayRanges,
  getRangeFromDays,
  normalizeSafeNumber,
  percentage,
  readCount,
  scanAnalyticsEventsByTypeInRange,
  startOfUtcDay,
  toIsoDate,
} from '@/server/admin/dashboard/dashboard.repository.core';

type TrendWindow = {
  current: number;
  previous: number;
};

type DurationWindow = {
  current: number | null;
  previous: number | null;
};

type FunnelRaw = {
  modalOpen: number;
  submitAttempt: number;
  submitSuccess: number;
  conversionRate: number;
  dropOffRate: number;
};

type SubmissionsTrendPointRaw = {
  month: string;
  value: number;
};

type ErrorsTrendPointRaw = {
  date: string;
  success: number;
  error: number;
};

export type SubmissionsOverviewRawAggregates = {
  kpis: {
    submissions7d: TrendWindow;
    conversion7d: TrendWindow;
    avgSubmitTime7d?: DurationWindow;
    errorRate7d?: TrendWindow;
  };
  funnel: FunnelRaw;
  charts: {
    submissionsTrend30d: SubmissionsTrendPointRaw[];
    errorsTrend30d?: ErrorsTrendPointRaw[];
  };
};

const MODAL_OPEN_EVENT_TYPES = [
  'contact_modal_open',
  'submission_modal_open',
  'modal_open',
] as const;

const SUBMIT_ATTEMPT_EVENT_TYPES = [
  'submit_attempt',
  'submission_attempt',
  'submit_project_attempt',
] as const;

const SUBMIT_ERROR_EVENT_TYPES = [
  'submit_error',
  'submission_error',
  'submit_project_error',
] as const;

function toSafeTimestampMs(value: unknown): number | null {
  if (value instanceof Timestamp) {
    return value.toMillis();
  }

  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : null;
  }

  return null;
}

function extractJoinKey(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;

  const map = metadata as Record<string, unknown>;
  const candidates = [
    map.sessionId,
    map.session_id,
    map.visitorId,
    map.visitor_id,
    map.clientId,
    map.client_id,
    map.anonymousId,
    map.anonymous_id,
    map.anonId,
    map.deviceId,
    map.device_id,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const normalized = candidate.trim();
      if (normalized.length > 0) {
        return normalized.slice(0, 128);
      }
    }

    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      return String(candidate);
    }
  }

  return null;
}

function isUploadInitStage(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return false;
  const map = metadata as Record<string, unknown>;
  return map.stage === 'upload_init';
}

async function countSubmissionsInRange(range: DateRange): Promise<number> {
  const firestore = getFirestoreDb();
  const query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(range.start))
    .where('createdAt', '<', Timestamp.fromDate(range.end));

  return readCount(query, 'Failed to count submissions in date range');
}

async function countAnyAnalyticsEventInRange(eventTypes: readonly string[], range: DateRange): Promise<number> {
  const counts = await Promise.all(eventTypes.map((eventType) => countAnalyticsEventInRange(eventType, range)));
  return normalizeSafeNumber(counts.reduce((acc, value) => acc + value, 0));
}

async function computeAverageSubmitTimeMinutes(range: DateRange): Promise<number | null> {
  const firstPageViewByKey = new Map<string, number>();
  const durations: number[] = [];

  await scanAnalyticsEventsByTypeInRange('page_view', range, (data) => {
    const key = extractJoinKey(data.metadata);
    const timestampMs = toSafeTimestampMs(data.timestamp);

    if (!key || timestampMs === null) {
      return;
    }

    const existing = firstPageViewByKey.get(key);
    if (existing === undefined || timestampMs < existing) {
      firstPageViewByKey.set(key, timestampMs);
    }
  });

  await scanAnalyticsEventsByTypeInRange('submit_project', range, (data) => {
    if (isUploadInitStage(data.metadata)) {
      return;
    }

    const key = extractJoinKey(data.metadata);
    const submitTimestampMs = toSafeTimestampMs(data.timestamp);

    if (!key || submitTimestampMs === null) {
      return;
    }

    const firstPageViewMs = firstPageViewByKey.get(key);
    if (firstPageViewMs === undefined || submitTimestampMs <= firstPageViewMs) {
      return;
    }

    const durationMinutes = (submitTimestampMs - firstPageViewMs) / (1000 * 60);
    if (Number.isFinite(durationMinutes) && durationMinutes >= 0) {
      durations.push(durationMinutes);
    }
  });

  if (durations.length === 0) {
    return null;
  }

  const total = durations.reduce((acc, value) => acc + value, 0);
  const average = total / durations.length;
  if (!Number.isFinite(average)) {
    return null;
  }

  return Number(average.toFixed(2));
}

function buildFunnelSnapshot(modalOpen: number, submitAttempt: number, submitSuccess: number): FunnelRaw {
  const baseline = modalOpen > 0
    ? modalOpen
    : submitAttempt;

  const conversionRate = percentage(submitSuccess, baseline);
  const rawDropOff = baseline > 0
    ? percentage(Math.max(baseline - submitSuccess, 0), baseline)
    : 0;

  return {
    modalOpen,
    submitAttempt,
    submitSuccess,
    conversionRate,
    dropOffRate: Number(rawDropOff.toFixed(2)),
  };
}

export async function getSubmissionsOverviewRawAggregates(): Promise<SubmissionsOverviewRawAggregates> {
  const todayStart = startOfUtcDay(new Date());
  const last7Days = getRangeFromDays(todayStart, 7, 0);
  const previous7Days = getRangeFromDays(todayStart, 7, 7);
  const dayRanges30 = getDayRanges(todayStart, 30);
  const monthRangesYear = getCurrentYearMonthRanges(todayStart);

  const [
    submissionsCurrent7,
    submissionsPrevious7,
    pageViewsCurrent7,
    pageViewsPrevious7,
    modalOpen7,
    submitAttemptCurrent7,
    submitErrorCurrent7,
    submitErrorPrevious7,
    submitAttemptPrevious7,
    avgSubmitTimeCurrent7,
    avgSubmitTimePrevious7,
    submissionsCountsYear,
    submissionsCounts30,
    errorsTrendCounts30,
  ] = await Promise.all([
    countSubmissionsInRange(last7Days),
    countSubmissionsInRange(previous7Days),
    countAnalyticsEventInRange('page_view', last7Days),
    countAnalyticsEventInRange('page_view', previous7Days),
    countAnyAnalyticsEventInRange(MODAL_OPEN_EVENT_TYPES, last7Days),
    countAnyAnalyticsEventInRange(SUBMIT_ATTEMPT_EVENT_TYPES, last7Days),
    countAnyAnalyticsEventInRange(SUBMIT_ERROR_EVENT_TYPES, last7Days),
    countAnyAnalyticsEventInRange(SUBMIT_ERROR_EVENT_TYPES, previous7Days),
    countAnyAnalyticsEventInRange(SUBMIT_ATTEMPT_EVENT_TYPES, previous7Days),
    computeAverageSubmitTimeMinutes(last7Days),
    computeAverageSubmitTimeMinutes(previous7Days),
    Promise.all(monthRangesYear.map(({ range }) => countSubmissionsInRange(range))),
    Promise.all(dayRanges30.map((range) => countSubmissionsInRange(range))),
    Promise.all(dayRanges30.map((range) => countAnyAnalyticsEventInRange(SUBMIT_ERROR_EVENT_TYPES, range))),
  ]);

  const submissionsTrend30d: SubmissionsTrendPointRaw[] = monthRangesYear.map((entry, index) => ({
    month: entry.month,
    value: normalizeSafeNumber(submissionsCountsYear[index] ?? 0),
  }));

  const conversionCurrent7 = percentage(submissionsCurrent7, pageViewsCurrent7);
  const conversionPrevious7 = percentage(submissionsPrevious7, pageViewsPrevious7);

  const hasErrorRateTracking =
    submitErrorCurrent7 > 0 || submitErrorPrevious7 > 0 || submitAttemptCurrent7 > 0 || submitAttemptPrevious7 > 0;

  const hasErrorTrend = errorsTrendCounts30.some((count) => count > 0);

  const errorsTrend30d: ErrorsTrendPointRaw[] | undefined = hasErrorTrend
    ? dayRanges30.map((range, index) => ({
        date: toIsoDate(range.start),
        success: normalizeSafeNumber(submissionsCounts30[index] ?? 0),
        error: normalizeSafeNumber(errorsTrendCounts30[index] ?? 0),
      }))
    : undefined;

  const funnel = buildFunnelSnapshot(
    normalizeSafeNumber(modalOpen7),
    normalizeSafeNumber(submitAttemptCurrent7),
    normalizeSafeNumber(submissionsCurrent7),
  );

  return {
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
      submissionsTrend30d,
      ...(errorsTrend30d ? { errorsTrend30d } : {}),
    },
  };
}
