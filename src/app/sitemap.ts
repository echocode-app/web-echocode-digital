import type { MetadataRoute } from 'next';

import { locales } from '@/i18n/config';
import { buildAbsoluteLocalizedUrl, type AppLocale } from '@/lib/seo/metadata';
import { listPublicVacancies } from '@/server/vacancies';

// Update this when meaningfully changing static page content
// hero copy, services, portfolio cases, team page.
const STATIC_LAST_MODIFIED = new Date('2026-05-01');

type StaticRoute = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
};

const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
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

function buildStaticEntries(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    STATIC_ROUTES.map((route) => ({
      url: buildAbsoluteLocalizedUrl(locale as AppLocale, route.path),
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  );
}

async function buildVacancyEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const vacancies = await listPublicVacancies();

    return vacancies.flatMap((vacancy) =>
      locales.map((locale) => ({
        url: buildAbsoluteLocalizedUrl(locale as AppLocale, `/career/${vacancy.vacancySlug}`),
        lastModified: vacancy.datePosted ? new Date(vacancy.datePosted) : STATIC_LAST_MODIFIED,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    );
  } catch (error) {
    console.error('[sitemap] failed to load vacancies, returning static routes only', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = buildStaticEntries();
  const vacancyEntries = await buildVacancyEntries();

  return [...staticEntries, ...vacancyEntries];
}
