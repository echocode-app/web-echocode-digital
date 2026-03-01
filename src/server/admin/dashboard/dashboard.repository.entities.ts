import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import {
  VACANCY_ANALYTICS_ID_KEYS,
  VACANCY_ANALYTICS_LABEL_KEYS,
} from '@/server/vacancies';
import type {
  SourcePerformanceDto,
  TopVacancyPointDto,
} from '@/server/admin/dashboard/dashboard.types';
import type { DateRange } from '@/server/admin/dashboard/dashboard.repository.core';
import {
  normalizeSafeNumber,
  percentage,
  scanAnalyticsEventsByTypeInRange,
} from '@/server/admin/dashboard/dashboard.repository.core';

type EventDoc = {
  metadata?: unknown;
};

const TOP_VACANCIES_LIMIT = 6;
const TOP_VACANCY_EVENTS_SCAN_LIMIT = 3000;

function normalizeSourceValue(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return normalized.slice(0, 64);
}

function extractAttributionSource(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const map = metadata as Record<string, unknown>;
  const attribution = map.attribution;
  if (!attribution || typeof attribution !== 'object' || Array.isArray(attribution)) return null;
  const attributionMap = attribution as Record<string, unknown>;
  return normalizeSourceValue(attributionMap.source);
}

// Extracts vacancy identity from known analytics metadata variants.
function extractVacancyKey(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;

  const map = metadata as Record<string, unknown>;
  const candidates = VACANCY_ANALYTICS_ID_KEYS.map((key) => map[key]);

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

// Resolves optional display label from metadata when available.
function extractVacancyLabel(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const map = metadata as Record<string, unknown>;
  const candidates = VACANCY_ANALYTICS_LABEL_KEYS.map((key) => map[key]);

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

// Falls back to vacancies collection to make top-vacancy labels stable.
async function getVacancyTitleByIdOrSlug(key: string): Promise<string | null> {
  const firestore = getFirestoreDb();

  try {
    const byId = await firestore.collection('vacancies').doc(key).get();
    if (byId.exists) {
      const title = byId.data()?.title;
      return typeof title === 'string' && title.trim().length > 0 ? title.trim() : key;
    }

    const bySlug = await firestore.collection('vacancies').where('slug', '==', key).limit(1).get();
    const first = bySlug.docs[0];
    if (!first) return null;

    const title = first.data().title;
    return typeof title === 'string' && title.trim().length > 0 ? title.trim() : key;
  } catch {
    return null;
  }
}

export async function getTopVacancies(last30DaysRange: DateRange): Promise<TopVacancyPointDto[]> {
  const firestore = getFirestoreDb();
  const startTs = Timestamp.fromDate(last30DaysRange.start);

  const queries = (['submit_vacancy', 'apply_vacancy'] as const).map((eventType) =>
    firestore
      .collection('analytics_events')
      .where('eventType', '==', eventType)
      .where('timestamp', '>=', startTs)
      .orderBy('timestamp', 'desc')
      .limit(TOP_VACANCY_EVENTS_SCAN_LIMIT)
      .get(),
  );

  let snapshots: FirebaseFirestore.QuerySnapshot[];

  try {
    snapshots = await Promise.all(queries);
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load vacancy application events', { cause });
  }

  const bucket = new Map<string, { count: number; label: string | null }>();

  for (const snapshot of snapshots) {
    for (const doc of snapshot.docs) {
      const data = doc.data() as EventDoc;
      const vacancyKey = extractVacancyKey(data.metadata);

      if (!vacancyKey) continue;

      const existing = bucket.get(vacancyKey);
      if (existing) {
        existing.count += 1;
        continue;
      }

      bucket.set(vacancyKey, {
        count: 1,
        label: extractVacancyLabel(data.metadata),
      });
    }
  }

  const ranked = Array.from(bucket.entries())
    .map(([vacancyId, value]) => ({
      vacancyId,
      applications: normalizeSafeNumber(value.count),
      label: value.label,
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, TOP_VACANCIES_LIMIT);

  const labels = await Promise.all(
    ranked.map(async (item) => item.label ?? (await getVacancyTitleByIdOrSlug(item.vacancyId))),
  );

  return ranked.map((item, index) => ({
    vacancyId: item.vacancyId,
    applications: item.applications,
    label: labels[index] ?? item.vacancyId,
  }));
}

function sortTopSources(
  sourceStats: Map<string, { pageViews: number; projectLeads: number; vacancyLeads: number }>,
): SourcePerformanceDto[] {
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
  statsMap: Map<string, { pageViews: number; projectLeads: number; vacancyLeads: number }>,
  source: string,
  input: Partial<{ pageViews: number; projectLeads: number; vacancyLeads: number }>,
): void {
  const current = statsMap.get(source) ?? { pageViews: 0, projectLeads: 0, vacancyLeads: 0 };
  current.pageViews += normalizeSafeNumber(input.pageViews ?? 0);
  current.projectLeads += normalizeSafeNumber(input.projectLeads ?? 0);
  current.vacancyLeads += normalizeSafeNumber(input.vacancyLeads ?? 0);
  statsMap.set(source, current);
}

// Source block is derived from first-touch metadata.attribution.source values.
export async function getSourcePerformance(last30Days: DateRange): Promise<SourcePerformanceDto[]> {
  const sourceStats = new Map<string, { pageViews: number; projectLeads: number; vacancyLeads: number }>();

  await Promise.all([
    scanAnalyticsEventsByTypeInRange('page_view', last30Days, (data) => {
      const source = extractAttributionSource(data.metadata);
      if (!source) return;
      addSourceStats(sourceStats, source, { pageViews: 1 });
    }),
    scanAnalyticsEventsByTypeInRange('submit_project', last30Days, (data) => {
      const source = extractAttributionSource(data.metadata);
      if (!source) return;
      addSourceStats(sourceStats, source, { projectLeads: 1 });
    }),
    scanAnalyticsEventsByTypeInRange('submit_vacancy', last30Days, (data) => {
      const source = extractAttributionSource(data.metadata);
      if (!source) return;
      addSourceStats(sourceStats, source, { vacancyLeads: 1 });
    }),
    scanAnalyticsEventsByTypeInRange('apply_vacancy', last30Days, (data) => {
      const source = extractAttributionSource(data.metadata);
      if (!source) return;
      addSourceStats(sourceStats, source, { vacancyLeads: 1 });
    }),
  ]);

  return sortTopSources(sourceStats);
}

async function getPortfolioTitleBySlug(slug: string): Promise<string | null> {
  const firestore = getFirestoreDb();

  try {
    const snapshot = await firestore.collection('portfolio').where('slug', '==', slug).limit(1).get();
    const first = snapshot.docs[0];
    if (!first) return null;

    const title = first.data().title;
    return typeof title === 'string' && title.trim().length > 0 ? title.trim() : null;
  } catch {
    return null;
  }
}

function extractPortfolioSlug(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const map = metadata as Record<string, unknown>;
  const slug = map.slug;
  if (typeof slug !== 'string') return null;
  const normalized = slug.trim();
  return normalized.length > 0 ? normalized : null;
}

function extractPortfolioTitle(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const map = metadata as Record<string, unknown>;
  const titleCandidates = [map.title, map.portfolioTitle, map.name];

  for (const value of titleCandidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

// Computes top portfolio item by scanning all page_view events within the 30d window.
export async function getTopPortfolioItem(last30Days: DateRange): Promise<{ title: string; views: number }> {
  const portfolioViews = new Map<string, { views: number; title: string | null }>();

  await scanAnalyticsEventsByTypeInRange('page_view', last30Days, (data) => {
    const metadata = data.metadata;
    const slug = extractPortfolioSlug(metadata);
    if (!slug) return;

    const existing = portfolioViews.get(slug);
    if (existing) {
      existing.views += 1;
      return;
    }

    portfolioViews.set(slug, {
      views: 1,
      title: extractPortfolioTitle(metadata),
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
