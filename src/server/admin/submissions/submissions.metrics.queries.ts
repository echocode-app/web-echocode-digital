import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';
import type { SiteId } from '@/server/sites/siteContext';
import {
  countAnalyticsEventInRange,
  normalizeSafeNumber,
  readCount,
  scanAnalyticsEventsByTypeInRange,
} from '@/server/admin/dashboard/dashboard.repository.core';

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

export async function countSubmissionsInRange(range: DateRange): Promise<number> {
  const firestore = getFirestoreDb();
  const legacySubmissionsQuery = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(range.start))
    .where('createdAt', '<', Timestamp.fromDate(range.end));

  const clientSubmissionsQuery = firestore
    .collection('client_submissions')
    .where('createdAt', '>=', Timestamp.fromDate(range.start))
    .where('createdAt', '<', Timestamp.fromDate(range.end));

  const [legacyCount, clientCount] = await Promise.all([
    readCount(legacySubmissionsQuery, 'Failed to count legacy submissions in date range'),
    readCount(clientSubmissionsQuery, 'Failed to count client submissions in date range'),
  ]);

  return normalizeSafeNumber(legacyCount + clientCount);
}

export async function countScopedSubmissionsInRange(
  range: DateRange,
  options: { siteId?: SiteId; includeClientSubmissions?: boolean } = {},
): Promise<number> {
  const firestore = getFirestoreDb();
  let legacySubmissionsQuery: FirebaseFirestore.Query = firestore
    .collection('submissions')
    .where('createdAt', '>=', Timestamp.fromDate(range.start))
    .where('createdAt', '<', Timestamp.fromDate(range.end));

  if (options.siteId) {
    legacySubmissionsQuery = legacySubmissionsQuery.where('siteId', '==', options.siteId);
  }

  const requests: Promise<number>[] = [
    readCount(legacySubmissionsQuery, 'Failed to count scoped legacy submissions in date range'),
  ];

  if (options.includeClientSubmissions !== false && !options.siteId) {
    const clientSubmissionsQuery = firestore
      .collection('client_submissions')
      .where('createdAt', '>=', Timestamp.fromDate(range.start))
      .where('createdAt', '<', Timestamp.fromDate(range.end));

    requests.push(
      readCount(clientSubmissionsQuery, 'Failed to count client submissions in date range'),
    );
  }

  const counts = await Promise.all(requests);
  return normalizeSafeNumber(counts.reduce((sum, value) => sum + value, 0));
}

export async function countAnyAnalyticsEventInRange(
  eventTypes: readonly string[],
  range: DateRange,
): Promise<number> {
  const counts = await Promise.all(
    eventTypes.map((eventType) => countAnalyticsEventInRange(eventType, range)),
  );
  return normalizeSafeNumber(counts.reduce((acc, value) => acc + value, 0));
}

export async function computeAverageSubmitTimeMinutes(range: DateRange): Promise<number | null> {
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
