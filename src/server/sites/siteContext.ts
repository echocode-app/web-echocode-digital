const WEB_ECHOCODE_APP_PREVIEW_ORIGIN_PATTERN =
  /^https:\/\/web-echocode-app(?:-[a-z0-9-]+)?\.vercel\.app$/i;
const ECHOCODE_NEWSITE_PREVIEW_ORIGIN_PATTERN =
  /^https:\/\/echocode-newsite(?:-[a-z0-9-]+)*\.vercel\.app$/i;
const LOCALHOST_ORIGIN_PATTERN = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i;
const LOCALHOST_HOST_PATTERN = /^(?:localhost|127\.0\.0\.1)(?::\d+)?$/i;

export const SITE_IDS = ['echocode_digital', 'echocode_app'] as const;

export type SiteId = (typeof SITE_IDS)[number];

type SiteDescriptor = {
  siteId: SiteId;
  siteHost: string;
  defaultSource: string;
  allowedOrigins: readonly string[];
  allowedOriginPatterns?: readonly RegExp[];
  acceptedHosts: readonly string[];
  acceptedHostPatterns?: readonly RegExp[];
};

export type ResolvedSiteContext = {
  siteId: SiteId;
  siteHost: string;
  defaultSource: string;
};

const SITE_REGISTRY: readonly SiteDescriptor[] = [
  {
    siteId: 'echocode_digital',
    siteHost: 'www.echocode.digital',
    defaultSource: 'website',
    allowedOrigins: [
      'http://localhost:3000',
      'https://echocode-newsite.vercel.app',
      'https://www.echocode.digital',
      'https://echocode.digital',
    ],
    allowedOriginPatterns: [LOCALHOST_ORIGIN_PATTERN, ECHOCODE_NEWSITE_PREVIEW_ORIGIN_PATTERN],
    acceptedHosts: [
      'localhost:3000',
      'echocode-newsite.vercel.app',
      'www.echocode.digital',
      'echocode.digital',
    ],
    acceptedHostPatterns: [
      LOCALHOST_HOST_PATTERN,
      /^echocode-newsite(?:-[a-z0-9-]+)*\.vercel\.app$/i,
    ],
  },
  {
    siteId: 'echocode_app',
    siteHost: 'echocode.app',
    defaultSource: 'echocode_app',
    allowedOrigins: [
      'http://localhost:3000',
      'https://echocode.app',
      'https://www.echocode.app',
      'https://web-echocode-app.vercel.app',
    ],
    allowedOriginPatterns: [LOCALHOST_ORIGIN_PATTERN, WEB_ECHOCODE_APP_PREVIEW_ORIGIN_PATTERN],
    acceptedHosts: [
      'localhost:3000',
      'echocode.app',
      'www.echocode.app',
      'web-echocode-app.vercel.app',
    ],
    acceptedHostPatterns: [
      LOCALHOST_HOST_PATTERN,
      /^web-echocode-app(?:-[a-z0-9-]+)?\.vercel\.app$/i,
    ],
  },
] as const;

const DEFAULT_SITE = SITE_REGISTRY[0];

function normalizeOptionalString(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeHost(value: string | null | undefined): string | null {
  const normalized = normalizeOptionalString(value);
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

function matchSiteById(siteId: string | null): SiteDescriptor | null {
  if (!siteId) return null;
  return SITE_REGISTRY.find((site) => site.siteId === siteId) ?? null;
}

function matchSiteByHost(host: string | null): SiteDescriptor | null {
  if (!host) return null;
  return (
    SITE_REGISTRY.find((site) => {
      if (site.acceptedHosts.includes(host)) {
        return true;
      }

      return site.acceptedHostPatterns?.some((pattern) => pattern.test(host)) ?? false;
    }) ?? null
  );
}

function matchSiteByOrigin(origin: string | null): SiteDescriptor | null {
  const normalizedOrigin = normalizeOptionalString(origin);
  if (!normalizedOrigin) return null;

  return (
    SITE_REGISTRY.find((site) => {
      if (site.allowedOrigins.includes(normalizedOrigin)) {
        return true;
      }

      return site.allowedOriginPatterns?.some((pattern) => pattern.test(normalizedOrigin)) ?? false;
    }) ?? null
  );
}

function isOriginAllowedForSite(origin: string | null, site: SiteDescriptor): boolean {
  const normalizedOrigin = normalizeOptionalString(origin);
  if (!normalizedOrigin) return true;

  if (site.allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  return site.allowedOriginPatterns?.some((pattern) => pattern.test(normalizedOrigin)) ?? false;
}

function isHostAcceptedForSite(host: string | null, site: SiteDescriptor): boolean {
  if (!host) return true;

  if (site.acceptedHosts.includes(host)) {
    return true;
  }

  return site.acceptedHostPatterns?.some((pattern) => pattern.test(host)) ?? false;
}

function getRequestHost(headers: Headers | undefined): string | null {
  if (!headers) return null;

  return (
    normalizeHost(headers.get('origin')) ||
    normalizeHost(headers.get('x-forwarded-host')) ||
    normalizeHost(headers.get('host')) ||
    normalizeHost(headers.get('referer'))
  );
}

export function resolveRequestSiteContext(
  input: {
    headers?: Headers;
    explicitSiteId?: string | null;
    explicitSiteHost?: string | null;
  } = {},
): ResolvedSiteContext {
  const byId = matchSiteById(normalizeOptionalString(input.explicitSiteId));
  if (byId) {
    return {
      siteId: byId.siteId,
      siteHost: byId.siteHost,
      defaultSource: byId.defaultSource,
    };
  }

  const bySiteHost = matchSiteByHost(normalizeHost(input.explicitSiteHost));
  if (bySiteHost) {
    return {
      siteId: bySiteHost.siteId,
      siteHost: bySiteHost.siteHost,
      defaultSource: bySiteHost.defaultSource,
    };
  }

  const byOrigin = matchSiteByOrigin(input.headers?.get('origin') ?? null);
  if (byOrigin) {
    return {
      siteId: byOrigin.siteId,
      siteHost: byOrigin.siteHost,
      defaultSource: byOrigin.defaultSource,
    };
  }

  const byRequestHost = matchSiteByHost(getRequestHost(input.headers));
  if (byRequestHost) {
    return {
      siteId: byRequestHost.siteId,
      siteHost: byRequestHost.siteHost,
      defaultSource: byRequestHost.defaultSource,
    };
  }

  return {
    siteId: DEFAULT_SITE.siteId,
    siteHost: DEFAULT_SITE.siteHost,
    defaultSource: DEFAULT_SITE.defaultSource,
  };
}

export function resolveStrictRequestSiteContext(
  input: {
    headers?: Headers;
    explicitSiteId?: string | null;
    explicitSiteHost?: string | null;
  } = {},
): ResolvedSiteContext | null {
  const explicitSiteId = normalizeOptionalString(input.explicitSiteId);
  const explicitSiteHost = normalizeHost(input.explicitSiteHost);
  const requestOrigin = input.headers?.get('origin') ?? null;

  if (explicitSiteId) {
    const byId = matchSiteById(explicitSiteId);
    if (!byId) return null;
    if (!isHostAcceptedForSite(explicitSiteHost, byId)) return null;
    if (!isOriginAllowedForSite(requestOrigin, byId)) return null;

    return {
      siteId: byId.siteId,
      siteHost: byId.siteHost,
      defaultSource: byId.defaultSource,
    };
  }

  if (explicitSiteHost) {
    const bySiteHost = matchSiteByHost(explicitSiteHost);
    if (!bySiteHost) return null;
    if (!isOriginAllowedForSite(requestOrigin, bySiteHost)) return null;

    return {
      siteId: bySiteHost.siteId,
      siteHost: bySiteHost.siteHost,
      defaultSource: bySiteHost.defaultSource,
    };
  }

  const byOrigin = matchSiteByOrigin(requestOrigin);
  if (byOrigin) {
    return {
      siteId: byOrigin.siteId,
      siteHost: byOrigin.siteHost,
      defaultSource: byOrigin.defaultSource,
    };
  }

  const byRequestHost = matchSiteByHost(getRequestHost(input.headers));
  if (byRequestHost) {
    return {
      siteId: byRequestHost.siteId,
      siteHost: byRequestHost.siteHost,
      defaultSource: byRequestHost.defaultSource,
    };
  }

  return null;
}

export function getPublicIngestAllowedOrigins(): string[] {
  return SITE_REGISTRY.flatMap((site) => site.allowedOrigins);
}

export function getPublicIngestAllowedOriginPatterns(): RegExp[] {
  return SITE_REGISTRY.flatMap((site) => site.allowedOriginPatterns ?? []);
}
