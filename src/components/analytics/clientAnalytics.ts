'use client';

import { captureFirstTouchAttribution, getStoredAttribution } from '@/lib/analytics/utm';

const SESSION_STORAGE_KEY = 'echocode_client_session_id';
const DEFAULT_SITE_ID = 'echocode_digital';
const DEFAULT_SITE_HOST = 'www.echocode.digital';

type ClientAnalyticsAttribution = {
  source: string;
  medium?: string;
  campaign?: string;
};

type ClientAnalyticsContextPayload = {
  siteId: string;
  siteHost: string;
  attribution?: ClientAnalyticsAttribution;
};

function createClientSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function getClientSiteHost(): string {
  if (typeof window === 'undefined') return DEFAULT_SITE_HOST;

  const normalized = window.location.host.trim();
  return normalized.length > 0 ? normalized : DEFAULT_SITE_HOST;
}

function getClientAttribution(): ClientAnalyticsAttribution | undefined {
  const stored = getStoredAttribution() ?? captureFirstTouchAttribution();
  if (!stored) return undefined;

  return {
    source: stored.source,
    ...(stored.medium ? { medium: stored.medium } : {}),
    ...(stored.campaign ? { campaign: stored.campaign } : {}),
  };
}

export function getClientAnalyticsSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  const fromStorage = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (fromStorage && fromStorage.trim().length > 0) {
    return fromStorage;
  }

  const created = createClientSessionId();
  window.localStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}

export function getClientAnalyticsContextPayload(): ClientAnalyticsContextPayload {
  const attribution = getClientAttribution();

  return {
    siteId: DEFAULT_SITE_ID,
    siteHost: getClientSiteHost(),
    ...(attribution ? { attribution } : {}),
  };
}

export function getClientAnalyticsHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-client-session-id': getClientAnalyticsSessionId(),
  };
}

export async function postClientAnalyticsEvent(
  url: string,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch(url, {
      method: 'POST',
      headers: getClientAnalyticsHeaders(),
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Best-effort analytics should never block the user flow.
  }
}
