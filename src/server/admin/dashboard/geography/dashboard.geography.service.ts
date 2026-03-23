import { getDashboardGeographyRaw } from '@/server/admin/dashboard/geography/dashboard.geography.repository';
import type { DashboardGeographyDto, DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';

const MAIN_SITE_ID = 'echocode_digital' as const;

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Number(value.toFixed(2));
}

export async function getAdminDashboardGeography(
  period: DashboardPeriod = 'week',
): Promise<DashboardGeographyDto> {
  const raw = await getDashboardGeographyRaw(period, { siteId: MAIN_SITE_ID });

  return {
    period: raw.period,
    totalPageViews: sanitizeNumber(raw.totalPageViews),
    countries: raw.countries.map((item) => ({
      country: item.country,
      views: sanitizeNumber(item.views),
      sharePct: sanitizeNumber(item.sharePct),
    })),
  };
}
