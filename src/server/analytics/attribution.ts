export type EventAttribution = {
  source: string;
  medium?: string;
  campaign?: string;
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeValue(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function pickAttribution(input: Record<string, unknown>): EventAttribution | null {
  const source = normalizeValue(input.source);
  if (!source) return null;

  const medium = normalizeValue(input.medium);
  const campaign = normalizeValue(input.campaign);

  return {
    source,
    medium,
    campaign,
  };
}

function extractAttributionFromRawBody(rawBody: unknown): EventAttribution | null {
  if (!isObjectRecord(rawBody)) return null;
  if (!('attribution' in rawBody)) return null;

  const attribution = rawBody.attribution;
  if (!isObjectRecord(attribution)) return null;

  return pickAttribution(attribution);
}

function extractAttributionFromUrl(urlString: string): EventAttribution | null {
  try {
    const url = new URL(urlString);

    const source = normalizeValue(url.searchParams.get('utm_source'));
    if (!source) return null;

    const medium = normalizeValue(url.searchParams.get('utm_medium'));
    const campaign = normalizeValue(url.searchParams.get('utm_campaign'));

    return {
      source,
      medium,
      campaign,
    };
  } catch {
    return null;
  }
}

function extractAttributionFromHeaders(headers?: Headers): EventAttribution | null {
  if (!headers) return null;

  const referrer = headers.get('referer');
  if (!referrer) return null;

  return extractAttributionFromUrl(referrer);
}

// First-touch attribution can be sent by client in body; referer UTM is used as safe fallback.
export function resolveEventAttribution(input: {
  rawBody?: unknown;
  headers?: Headers;
}): EventAttribution | null {
  const fromBody = extractAttributionFromRawBody(input.rawBody);
  if (fromBody) return fromBody;

  return extractAttributionFromHeaders(input.headers);
}
