type AnalyticsRecord = Record<string, unknown>;

function readString(record: AnalyticsRecord, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readMetadata(record: AnalyticsRecord): AnalyticsRecord | null {
  const value = record.metadata;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as AnalyticsRecord;
}

export function normalizeHostCandidate(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  if (!normalized) return null;

  try {
    return new URL(normalized).host.toLowerCase();
  } catch {
    return normalized
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .trim();
  }
}

export function isLocalhostHost(host: string | null | undefined): boolean {
  const normalized = normalizeHostCandidate(host);
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

export function resolveAnalyticsRuntimeHost(input: {
  headers?: Headers;
  explicitSiteHost?: string | null | undefined;
  metadata?: Record<string, unknown> | undefined;
}): string | null {
  const metadata = input.metadata ?? {};

  return (
    normalizeHostCandidate(
      typeof metadata.siteHost === 'string' ? metadata.siteHost : input.explicitSiteHost,
    ) ||
    normalizeHostCandidate(input.headers?.get('origin')) ||
    normalizeHostCandidate(input.headers?.get('x-forwarded-host')) ||
    normalizeHostCandidate(input.headers?.get('host')) ||
    normalizeHostCandidate(input.headers?.get('referer'))
  );
}

export function shouldSkipLocalhostAnalytics(input: {
  headers?: Headers;
  explicitSiteHost?: string | null | undefined;
  metadata?: Record<string, unknown> | undefined;
}): boolean {
  return isLocalhostHost(resolveAnalyticsRuntimeHost(input));
}

export function isLocalhostAnalyticsEvent(record: AnalyticsRecord): boolean {
  const metadata = readMetadata(record) ?? {};
  const explicitFlag = metadata.isLocalhost;

  if (explicitFlag === true) {
    return true;
  }

  return [
    readString(metadata, 'runtimeHost'),
    readString(metadata, 'requestHost'),
    readString(metadata, 'url'),
    readString(metadata, 'referrer'),
  ].some((candidate) => isLocalhostHost(candidate));
}
