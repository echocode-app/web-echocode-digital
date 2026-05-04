import type { Metadata } from 'next';

import { defaultLocale, locales } from '@/i18n/config';

const BASE_URL = 'https://echocode.digital';
const TWITTER_IMAGE = '/favicon/fulllogo.png';

// Map URL slug locale to BCP 47 hreflang code.
// Ukrainian uses 'uk' as a language code while the URL slug stays 'ua'.
const HREFLANG_BY_LOCALE: Record<string, string> = {
  en: 'en',
  ua: 'uk',
  de: 'de',
  es: 'es',
  pl: 'pl',
};

const OG_LOCALE_BY_LOCALE: Record<string, string> = {
  en: 'en_US',
  ua: 'uk_UA',
  de: 'de_DE',
  es: 'es_ES',
  pl: 'pl_PL',
};

export function buildLocaleUrl(locale: string, path: string): string {
  const normalizedPath = path === '/' ? '' : path;
  if (locale === defaultLocale) {
    return `${BASE_URL}${normalizedPath || '/'}`;
  }
  return `${BASE_URL}/${locale}${normalizedPath}`;
}

function buildLanguageAlternates(path: string): Record<string, string> {
  const result: Record<string, string> = {
    'x-default': buildLocaleUrl(defaultLocale, path),
  };
  for (const locale of locales) {
    const hreflang = HREFLANG_BY_LOCALE[locale] ?? locale;
    result[hreflang] = buildLocaleUrl(locale, path);
  }
  return result;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale: string;
  image?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  locale,
  image = '/images/rabbits/hero/design.png',
}: PageMetadataInput): Metadata {
  const canonicalUrl = buildLocaleUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title: `${title} | Echocode`,
      description,
      url: canonicalUrl,
      siteName: 'Echocode',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} | Echocode`,
        },
      ],
      locale: OG_LOCALE_BY_LOCALE[locale] ?? OG_LOCALE_BY_LOCALE[defaultLocale],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Echocode`,
      description,
      images: [TWITTER_IMAGE],
    },
  };
}

export const seoBaseUrl = BASE_URL;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildLocaleUrl(locale, item.path),
    })),
  };
}
