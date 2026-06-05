'use client';

export const ECHO_TRACKING_KEYS = [
  'gclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export type EchoTrackingKey = (typeof ECHO_TRACKING_KEYS)[number];
export type EchoTrackingPayload = Partial<Record<EchoTrackingKey, string>>;

declare global {
  interface Window {
    echoTracking?: () => EchoTrackingPayload;
  }
}

function readTrackingCookies(): EchoTrackingPayload {
  if (typeof document === 'undefined') return {};

  const safeDecode = (value: string) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  const cookies = Object.fromEntries(
    document.cookie
      .split('; ')
      .filter(Boolean)
      .map((cookie) => {
        const separatorIndex = cookie.indexOf('=');
        if (separatorIndex === -1) return [cookie, ''];

        return [
          cookie.slice(0, separatorIndex),
          safeDecode(cookie.slice(separatorIndex + 1)),
        ];
      }),
  );

  return ECHO_TRACKING_KEYS.reduce<EchoTrackingPayload>((payload, key) => {
    const value = cookies[key]?.trim();
    return value ? { ...payload, [key]: value } : payload;
  }, {});
}

export function getEchoTrackingPayload(): EchoTrackingPayload {
  if (typeof window !== 'undefined' && typeof window.echoTracking === 'function') {
    return window.echoTracking();
  }

  return readTrackingCookies();
}
