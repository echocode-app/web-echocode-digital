export type ClientSiteConfig = {
  siteId: 'echocode_digital' | 'echocode_app';
  siteHost: string;
  defaultSource: string;
};

const DEFAULT_SITE_CONFIG: ClientSiteConfig = {
  siteId: 'echocode_digital',
  siteHost: 'www.echocode.digital',
  defaultSource: 'website',
};

function normalizeHost(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : null;
}

function resolveHostSiteConfig(host: string | null): ClientSiteConfig {
  if (!host) {
    return DEFAULT_SITE_CONFIG;
  }

  if (
    host === 'echocode.app' ||
    host === 'www.echocode.app' ||
    host === 'web-echocode-app.vercel.app' ||
    /^web-echocode-app(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(host)
  ) {
    return {
      siteId: 'echocode_app',
      siteHost: 'echocode.app',
      defaultSource: 'echocode_app',
    };
  }

  if (
    host === 'echocode.digital' ||
    host === 'www.echocode.digital' ||
    host === 'echocode.cloud' ||
    host === 'www.echocode.cloud' ||
    host === 'echocode-newsite.vercel.app' ||
    /^echocode-newsite(?:-[a-z0-9-]+)*\.vercel\.app$/i.test(host)
  ) {
    return DEFAULT_SITE_CONFIG;
  }

  return DEFAULT_SITE_CONFIG;
}

export function getClientSiteConfig(): ClientSiteConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_CONFIG;
  }

  return resolveHostSiteConfig(normalizeHost(window.location.host));
}
