import type { Metadata } from 'next';

import { defaultLocale, localePrefixes } from '@/i18n/config';
import type { AppLocale } from '@/i18n/config';

export const seoBaseUrl = 'https://echocode.digital';
export type { AppLocale } from '@/i18n/config';

const SOCIAL_PREVIEW_IMAGE = '/favicon/og-cover.png';

const openGraphLocales: Record<AppLocale, string> = {
  en: 'en_US',
  uk: 'uk_UA',
  de: 'de_DE',
  es: 'es_ES',
  pl: 'pl_PL',
};

type PageMetadataInput = {
  locale: AppLocale;
  title: string;
  description: string;
  path: string;
};

export type BreadcrumbItem = {
  name: string;
  path: string;
};

function normalizePath(path: string): string {
  return path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
}

export function buildLocalizedPath(locale: AppLocale, path: string): string {
  return `${localePrefixes[locale]}${normalizePath(path)}`;
}

export function buildAbsoluteLocalizedUrl(locale: AppLocale, path: string): string {
  return `${seoBaseUrl}${buildLocalizedPath(locale, path)}`;
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  return {
    en: buildAbsoluteLocalizedUrl('en', path),
    uk: buildAbsoluteLocalizedUrl('uk', path),
    de: buildAbsoluteLocalizedUrl('de', path),
    es: buildAbsoluteLocalizedUrl('es', path),
    pl: buildAbsoluteLocalizedUrl('pl', path),
    'x-default': buildAbsoluteLocalizedUrl(defaultLocale, path),
  };
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const absoluteUrl = buildAbsoluteLocalizedUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title: `${title} | Echocode`,
      description,
      url: absoluteUrl,
      siteName: 'Echocode',
      images: [
        {
          url: SOCIAL_PREVIEW_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} | Echocode`,
        },
      ],
      locale: openGraphLocales[locale],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Echocode`,
      description,
      images: [SOCIAL_PREVIEW_IMAGE],
    },
  };
}

export function buildBreadcrumbSchema(locale: AppLocale, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteLocalizedUrl(locale, item.path),
    })),
  };
}
