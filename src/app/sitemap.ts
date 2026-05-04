import type { MetadataRoute } from 'next';

import { defaultLocale, locales } from '@/i18n/config';
import { listPublicVacancies } from '@/server/vacancies';

const baseUrl = 'https://echocode.digital';

// Update this when meaningfully changing static page content
// (hero copy, services, portfolio cases, team page).
const STATIC_LAST_MODIFIED = new Date('2026-05-01');

const HREFLANG_BY_LOCALE: Record<string, string> = {
  en: 'en',
  ua: 'uk',
  de: 'de',
  es: 'es',
  pl: 'pl',
};

type StaticRoute = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
};

const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/career', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/partnership', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/portfolio', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/portfolio/cleaning', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/portfolio/e-commers', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/portfolio/food', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/service-direction/design', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/service-direction/game-development', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/service-direction/igaming', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/service-direction/mobile-development', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/service-direction/qa', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/service-direction/web-development', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/team', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
];

function buildLocalePath(locale: string, path: string): string {
  const normalizedPath = path === '' ? '' : path;
  if (locale === defaultLocale) {
    return `${baseUrl}${normalizedPath || '/'}`;
  }
  return `${baseUrl}/${locale}${normalizedPath}`;
}

function buildLanguageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {
    'x-default': buildLocalePath(defaultLocale, path),
  };
  for (const locale of locales) {
    const hreflang = HREFLANG_BY_LOCALE[locale] ?? locale;
    alternates[hreflang] = buildLocalePath(locale, path);
  }
  return alternates;
}

function buildEntriesForPath(
  path: string,
  lastModified: Date,
  changeFrequency: StaticRoute['changeFrequency'],
  priority: number,
): MetadataRoute.Sitemap {
  const languages = buildLanguageAlternates(path);
  return locales.map((locale) => ({
    url: buildLocalePath(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

async function buildVacancyEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const vacancies = await listPublicVacancies();
    return vacancies.flatMap((vacancy) => {
      const path = `/career/${vacancy.vacancySlug}`;
      const lastModified = vacancy.datePosted
        ? new Date(vacancy.datePosted)
        : STATIC_LAST_MODIFIED;
      return buildEntriesForPath(path, lastModified, 'weekly', 0.7);
    });
  } catch (error) {
    console.error('[sitemap] failed to load vacancies, returning static routes only', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) =>
    buildEntriesForPath(
      route.path,
      STATIC_LAST_MODIFIED,
      route.changeFrequency,
      route.priority,
    ),
  );

  const vacancyEntries = await buildVacancyEntries();

  return [...staticEntries, ...vacancyEntries];
}
