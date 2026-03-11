const WEB_ECHOCODE_APP_PREVIEW_ORIGIN_PATTERN =
  /^https:\/\/web-echocode-app(?:-[a-z0-9-]+)?\.vercel\.app$/i;

export const SITE_IDS = ['echocode_digital', 'echocode_app'] as const;

export type SiteId = (typeof SITE_IDS)[number];

type SiteDescriptor = {
  siteId: SiteId;
  siteHost: string;
  defaultSource: string;
  allowedOrigins: readonly string[];
  allowedOriginPatterns?: readonly RegExp[];
  acceptedHosts: readonly string[];
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
    allowedOrigins: ['https://www.echocode.digital'],
    acceptedHosts: ['www.echocode.digital', 'echocode.digital'],
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
    allowedOriginPatterns: [WEB_ECHOCODE_APP_PREVIEW_ORIGIN_PATTERN],
    acceptedHosts: ['echocode.app', 'www.echocode.app', 'web-echocode-app.vercel.app'],
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
  return SITE_REGISTRY.find((site) => site.acceptedHosts.includes(host)) ?? null;
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

export function getPublicIngestAllowedOrigins(): string[] {
  return SITE_REGISTRY.flatMap((site) => site.allowedOrigins);
}

export function getPublicIngestAllowedOriginPatterns(): RegExp[] {
  return SITE_REGISTRY.flatMap((site) => site.allowedOriginPatterns ?? []);
}
