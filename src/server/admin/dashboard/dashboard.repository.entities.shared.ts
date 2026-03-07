import { getFirestoreDb } from '@/server/firebase/firestore';
import { VACANCY_ANALYTICS_ID_KEYS, VACANCY_ANALYTICS_LABEL_KEYS } from '@/server/vacancies';

export type DashboardEntityEventDoc = {
  metadata?: unknown;
};

export const TOP_VACANCIES_LIMIT = 6;
export const TOP_VACANCY_EVENTS_SCAN_LIMIT = 3000;

function isMetadataMap(metadata: unknown): metadata is Record<string, unknown> {
  return Boolean(metadata) && typeof metadata === 'object' && !Array.isArray(metadata);
}

export function normalizeSourceValue(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return normalized.slice(0, 64);
}

export function extractAttributionSource(metadata: unknown): string | null {
  if (!isMetadataMap(metadata)) return null;

  const attribution = metadata.attribution;
  if (!isMetadataMap(attribution)) return null;

  return normalizeSourceValue(attribution.source);
}

// Extracts vacancy identity from known analytics metadata variants.
export function extractVacancyKey(metadata: unknown): string | null {
  if (!isMetadataMap(metadata)) return null;

  const candidates = VACANCY_ANALYTICS_ID_KEYS.map((key) => metadata[key]);

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

// Resolves optional display label from metadata when available.
export function extractVacancyLabel(metadata: unknown): string | null {
  if (!isMetadataMap(metadata)) return null;

  const candidates = VACANCY_ANALYTICS_LABEL_KEYS.map((key) => metadata[key]);

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

// Falls back to vacancies collection to make top-vacancy labels stable.
export async function getVacancyTitleByIdOrSlug(key: string): Promise<string | null> {
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

export async function getPortfolioTitleBySlug(slug: string): Promise<string | null> {
  const firestore = getFirestoreDb();

  try {
    const snapshot = await firestore
      .collection('portfolio')
      .where('slug', '==', slug)
      .limit(1)
      .get();
    const first = snapshot.docs[0];
    if (!first) return null;

    const title = first.data().title;
    return typeof title === 'string' && title.trim().length > 0 ? title.trim() : null;
  } catch {
    return null;
  }
}

export function extractPortfolioSlug(metadata: unknown): string | null {
  if (!isMetadataMap(metadata)) return null;

  const slug = metadata.slug;
  if (typeof slug !== 'string') return null;

  const normalized = slug.trim();
  return normalized.length > 0 ? normalized : null;
}

export function extractPortfolioTitle(metadata: unknown): string | null {
  if (!isMetadataMap(metadata)) return null;

  const titleCandidates = [metadata.title, metadata.portfolioTitle, metadata.name];

  for (const value of titleCandidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}
