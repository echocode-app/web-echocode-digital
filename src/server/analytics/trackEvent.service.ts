import { FieldValue } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { logger } from '@/server/lib/logger';

export type AnalyticsEventType =
  | 'submit_project'
  | 'submit_vacancy'
  | 'apply_vacancy'
  | 'page_view';

type AnalyticsEventDoc = {
  eventType: AnalyticsEventType;
  source: string | null;
  country: string | null;
  metadata: Record<string, string | number | boolean | null>;
  timestamp: FieldValue;
};

export type TrackEventInput = {
  eventType: AnalyticsEventType;
  headers?: Headers;
  source?: string;
  metadata?: Record<string, unknown>;
};

function toSafeMetadata(
  metadata: Record<string, unknown> | undefined,
): Record<string, string | number | boolean | null> {
  if (!metadata) return {};

  const safe: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      safe[key] = value;
      continue;
    }

    if (value == null) {
      safe[key] = null;
    }
  }

  return safe;
}

function extractSource(headers?: Headers, explicitSource?: string): string | null {
  if (explicitSource) return explicitSource;
  if (!headers) return null;

  const referer = headers.get('referer');
  if (!referer) return null;

  try {
    const url = new URL(referer);
    const utmSource = url.searchParams.get('utm_source');
    const utmCampaign = url.searchParams.get('utm_campaign');

    if (utmSource && utmCampaign) {
      return `${utmSource}:${utmCampaign}`;
    }

    if (utmSource) return utmSource;
  } catch {
    return null;
  }

  return null;
}

function extractCountry(headers?: Headers): string | null {
  if (!headers) return null;
  return (
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    headers.get('x-country-code') ||
    null
  );
}

export async function trackEvent(input: TrackEventInput): Promise<void> {
  const payload: AnalyticsEventDoc = {
    eventType: input.eventType,
    source: extractSource(input.headers, input.source),
    country: extractCountry(input.headers),
    metadata: toSafeMetadata(input.metadata),
    timestamp: FieldValue.serverTimestamp(),
  };

  await getFirestoreDb().collection('analytics_events').add(payload);
}

export async function trackEventBestEffort(input: TrackEventInput): Promise<void> {
  try {
    await trackEvent(input);
  } catch (cause) {
    logger.warn('analytics_event_write_failed', {
      eventType: input.eventType,
      cause,
    });
  }
}
