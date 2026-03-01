import { FieldValue } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { logger } from '@/server/lib/logger';
import { resolveEventAttribution } from '@/server/analytics/attribution';

export type AnalyticsEventType =
  | 'submit_project'
  | 'submit_vacancy'
  | 'apply_vacancy'
  | 'page_view'
  | 'contact_modal_open'
  | 'submit_project_attempt'
  | 'submit_project_error';

type AnalyticsEventDoc = {
  eventType: AnalyticsEventType;
  source: string | null;
  country: string | null;
  metadata: AnalyticsMetadataMap;
  timestamp: FieldValue;
};

type AnalyticsMetadataPrimitive = string | number | boolean | null;
interface AnalyticsMetadataMap {
  [key: string]: AnalyticsMetadataPrimitive | AnalyticsMetadataMap;
}

export type TrackEventInput = {
  eventType: AnalyticsEventType;
  headers?: Headers;
  source?: string;
  metadata?: Record<string, unknown>;
};

function toSafeMetadata(
  metadata: Record<string, unknown> | undefined,
): AnalyticsMetadataMap {
  if (!metadata) return {};

  const safe: AnalyticsMetadataMap = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      safe[key] = value;
      continue;
    }

    if (value == null) {
      safe[key] = null;
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = toSafeMetadata(value as Record<string, unknown>);
      if (Object.keys(nested).length > 0) {
        safe[key] = nested;
      }
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

function hasAttributionMetadata(metadata: AnalyticsMetadataMap): boolean {
  const attribution = metadata.attribution;
  return typeof attribution === 'object' && attribution !== null && !Array.isArray(attribution);
}

function withPageViewAttribution(
  eventType: AnalyticsEventType,
  metadata: AnalyticsMetadataMap,
  input: TrackEventInput,
): AnalyticsMetadataMap {
  if (eventType !== 'page_view' || hasAttributionMetadata(metadata)) {
    return metadata;
  }

  const attribution = resolveEventAttribution({
    rawBody: input.metadata,
    headers: input.headers,
  });

  if (!attribution) {
    return metadata;
  }

  return {
    ...metadata,
    attribution: {
      source: attribution.source,
      medium: attribution.medium ?? null,
      campaign: attribution.campaign ?? null,
    },
  };
}

export async function trackEvent(input: TrackEventInput): Promise<void> {
  const safeMetadata = toSafeMetadata(input.metadata);

  const payload: AnalyticsEventDoc = {
    eventType: input.eventType,
    source: extractSource(input.headers, input.source),
    country: extractCountry(input.headers),
    metadata: withPageViewAttribution(input.eventType, safeMetadata, input),
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
