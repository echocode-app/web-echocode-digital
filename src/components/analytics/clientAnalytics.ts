'use client';

import { captureFirstTouchAttribution, getStoredAttribution } from '@/lib/analytics/utm';
import { getClientSiteConfig } from '@/lib/site/clientSiteContext';

const SESSION_STORAGE_KEY = 'echocode_client_session_id';

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

function isLocalhostHost(host: string | null | undefined): boolean {
  const normalized = host?.trim().toLowerCase();
  if (!normalized) return false;

  return (
    normalized === 'localhost' ||
    normalized.startsWith('localhost:') ||
    normalized === '127.0.0.1' ||
    normalized.startsWith('127.0.0.1:') ||
    normalized === '0.0.0.0' ||
    normalized.startsWith('0.0.0.0:') ||
    normalized === '[::1]' ||
    normalized.startsWith('[::1]:') ||
    normalized === '::1'
  );
}

function shouldDisableClientAnalytics(): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  return isLocalhostHost(window.location.host);
}

function createClientSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
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
  const siteConfig = getClientSiteConfig();

  return {
    siteId: siteConfig.siteId,
    siteHost: siteConfig.siteHost,
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
  if (shouldDisableClientAnalytics()) {
    return;
  }

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
