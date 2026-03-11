import type { SourcePerformanceDto } from '@/server/admin/dashboard/dashboard.types';
import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';
import type { SiteId } from '@/server/sites/siteContext';
import {
  normalizeSafeNumber,
  percentage,
  scanAnalyticsEventsByTypeInRange,
} from '@/server/admin/dashboard/dashboard.repository.core';
import { extractAttributionSource } from '@/server/admin/dashboard/dashboard.repository.entities.shared';

type SourceStats = {
  pageViews: number;
  projectLeads: number;
  vacancyLeads: number;
};

function sortTopSources(sourceStats: Map<string, SourceStats>): SourcePerformanceDto[] {
  const totalLeadsAcrossSources = Array.from(sourceStats.values()).reduce(
    (acc, stats) => acc + normalizeSafeNumber(stats.projectLeads + stats.vacancyLeads),
    0,
  );

  return Array.from(sourceStats.entries())
    .map(([source, stats]) => {
      const leads = normalizeSafeNumber(stats.projectLeads + stats.vacancyLeads);
      return {
        source,
        leads,
        share: percentage(leads, totalLeadsAcrossSources),
        conversionRate: percentage(leads, stats.pageViews),
      };
    })
    .filter((row) => row.leads > 0)
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 5);
}

function addSourceStats(
  statsMap: Map<string, SourceStats>,
  source: string,
  input: Partial<SourceStats>,
): void {
  const current = statsMap.get(source) ?? { pageViews: 0, projectLeads: 0, vacancyLeads: 0 };
  current.pageViews += normalizeSafeNumber(input.pageViews ?? 0);
  current.projectLeads += normalizeSafeNumber(input.projectLeads ?? 0);
  current.vacancyLeads += normalizeSafeNumber(input.vacancyLeads ?? 0);
  statsMap.set(source, current);
}

// Source block is derived from first-touch metadata.attribution.source values.
export async function getSourcePerformance(
  last30Days: DateRange,
  options: { siteId?: SiteId } = {},
): Promise<SourcePerformanceDto[]> {
  const sourceStats = new Map<string, SourceStats>();

  await Promise.all([
    scanAnalyticsEventsByTypeInRange('page_view', last30Days, (data) => {
      const source = extractAttributionSource(data.metadata);
      if (!source) return;
      addSourceStats(sourceStats, source, { pageViews: 1 });
    }, options),
    scanAnalyticsEventsByTypeInRange('submit_project', last30Days, (data) => {
      const source = extractAttributionSource(data.metadata);
      if (!source) return;
      addSourceStats(sourceStats, source, { projectLeads: 1 });
    }, options),
    scanAnalyticsEventsByTypeInRange('submit_vacancy', last30Days, (data) => {
      const source = extractAttributionSource(data.metadata);
      if (!source) return;
      addSourceStats(sourceStats, source, { vacancyLeads: 1 });
    }, options),
    scanAnalyticsEventsByTypeInRange('apply_vacancy', last30Days, (data) => {
      const source = extractAttributionSource(data.metadata);
      if (!source) return;
      addSourceStats(sourceStats, source, { vacancyLeads: 1 });
    }, options),
  ]);

  return sortTopSources(sourceStats);
}
