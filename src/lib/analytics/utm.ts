export type Attribution = {
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  timestamp: string;
};

const ATTRIBUTION_STORAGE_KEY = 'echocode_attribution';

function isBrowser(): boolean {
  // Protect all localStorage/window usage during SSR.
  return typeof window !== 'undefined';
}

function normalizeValue(value: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function readAttributionFromSearchParams(searchParams: URLSearchParams): Attribution | null {
  // First-touch requires at least utm_source to be meaningful.
  const source = normalizeValue(searchParams.get('utm_source'));
  if (!source) return null;

  return {
    source,
    medium: normalizeValue(searchParams.get('utm_medium')),
    campaign: normalizeValue(searchParams.get('utm_campaign')),
    content: normalizeValue(searchParams.get('utm_content')),
    term: normalizeValue(searchParams.get('utm_term')),
    timestamp: new Date().toISOString(),
  };
}

function safeParseStoredAttribution(value: string | null): Attribution | null {
  if (!value) return null;

  try {
    // Tolerate malformed/legacy payloads and fail closed.
    const parsed = JSON.parse(value) as Partial<Attribution>;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.source !== 'string' || parsed.source.trim().length === 0) return null;
    if (typeof parsed.timestamp !== 'string' || parsed.timestamp.trim().length === 0) return null;

    return {
      source: parsed.source.trim(),
      medium: typeof parsed.medium === 'string' ? parsed.medium.trim() : undefined,
      campaign: typeof parsed.campaign === 'string' ? parsed.campaign.trim() : undefined,
      content: typeof parsed.content === 'string' ? parsed.content.trim() : undefined,
      term: typeof parsed.term === 'string' ? parsed.term.trim() : undefined,
      timestamp: parsed.timestamp,
    };
  } catch {
    return null;
  }
}

export function getStoredAttribution(): Attribution | null {
  if (!isBrowser()) return null;
  // Read-only accessor used by event payload builders.
  return safeParseStoredAttribution(window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY));
}

export function captureFirstTouchAttribution(): Attribution | null {
  if (!isBrowser()) return null;

  // Do not overwrite attribution once the first touch is recorded.
  const existing = getStoredAttribution();
  if (existing) return existing;

  const candidate = readAttributionFromSearchParams(new URLSearchParams(window.location.search));
  if (!candidate) return null;

  // Persist one-time first-touch attribution for subsequent conversions.
  window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(candidate));
  return candidate;
}
