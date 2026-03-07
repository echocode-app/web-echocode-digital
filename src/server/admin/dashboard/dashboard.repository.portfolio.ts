import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';
import {
  normalizeSafeNumber,
  scanAnalyticsEventsByTypeInRange,
} from '@/server/admin/dashboard/dashboard.repository.core';
import {
  extractPortfolioSlug,
  extractPortfolioTitle,
  getPortfolioTitleBySlug,
} from '@/server/admin/dashboard/dashboard.repository.entities.shared';

// Computes top portfolio item by scanning all page_view events within the 30d window.
export async function getTopPortfolioItem(
  last30Days: DateRange,
): Promise<{ title: string; views: number }> {
  const portfolioViews = new Map<string, { views: number; title: string | null }>();

  await scanAnalyticsEventsByTypeInRange('page_view', last30Days, (data) => {
    const slug = extractPortfolioSlug(data.metadata);
    if (!slug) return;

    const existing = portfolioViews.get(slug);
    if (existing) {
      existing.views += 1;
      return;
    }

    portfolioViews.set(slug, {
      views: 1,
      title: extractPortfolioTitle(data.metadata),
    });
  });

  const top = Array.from(portfolioViews.entries())
    .map(([slug, value]) => ({
      slug,
      views: normalizeSafeNumber(value.views),
      title: value.title,
    }))
    .sort((a, b) => b.views - a.views)[0];

  if (!top || top.views <= 0) {
    return { title: 'No data', views: 0 };
  }

  const resolvedTitle = top.title ?? (await getPortfolioTitleBySlug(top.slug)) ?? top.slug;
  return { title: resolvedTitle, views: top.views };
}
