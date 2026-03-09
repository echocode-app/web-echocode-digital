import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAdminUserProfileByUid } from '@/server/admin/admin-users.service';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import {
  buildPortfolioSlugFromTitle,
  deletePortfolioImage,
  resolvePortfolioImageUrl,
} from '@/server/portfolio/portfolio.upload.service';
import type {
  CreateAdminPortfolioPreviewProjectInput,
  ManagedPortfolioPreviewProjectRecord,
  PortfolioCategory,
  PortfolioPlatform,
  PortfolioPreviewProjectItem,
} from '@/server/portfolio/portfolio.types';
import {
  PORTFOLIO_CATEGORY_VALUES,
  PORTFOLIO_PLATFORM_VALUES,
  PORTFOLIO_PREVIEW_ENTRY_TYPE,
} from '@/shared/portfolio/portfolio.constants';

const PORTFOLIO_COLLECTION = 'portfolio';

type PortfolioFirestoreDoc = {
  title?: unknown;
  slug?: unknown;
  image?: unknown;
  imagePath?: unknown;
  platforms?: unknown;
  categories?: unknown;
  isPublished?: unknown;
  entryType?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  updatedBy?: unknown;
};

function normalizeString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeIsoTimestamp(value: unknown): string | null {
  if (!(value instanceof Timestamp)) return null;
  return value.toDate().toISOString();
}

function normalizeStringList<TValue extends string>(
  value: unknown,
  allowed: readonly TValue[],
): TValue[] {
  if (!Array.isArray(value)) return [];

  const allowedSet = new Set(allowed);
  const normalized: TValue[] = [];

  value.forEach((item) => {
    const current = normalizeString(item)?.toLowerCase();
    if (!current) return;
    if (!allowedSet.has(current as TValue)) return;
    if (normalized.includes(current as TValue)) return;
    normalized.push(current as TValue);
  });

  return normalized;
}

function isPreviewCardDoc(data: PortfolioFirestoreDoc): boolean {
  return data.entryType === PORTFOLIO_PREVIEW_ENTRY_TYPE;
}

async function attachUpdatedByProfiles(
  records: ManagedPortfolioPreviewProjectRecord[],
): Promise<ManagedPortfolioPreviewProjectRecord[]> {
  const profilesByUid = new Map<string, Awaited<ReturnType<typeof getAdminUserProfileByUid>>>();

  await Promise.all(
    records.map(async (record) => {
      const uid = record.updatedBy?.trim();
      if (!uid || profilesByUid.has(uid)) return;
      profilesByUid.set(uid, await getAdminUserProfileByUid(uid));
    }),
  );

  return records.map((record) => ({
    ...record,
    updatedByProfile: record.updatedBy ? (profilesByUid.get(record.updatedBy) ?? null) : null,
  }));
}

function toManagedPreviewRecord(
  snapshot: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot,
): ManagedPortfolioPreviewProjectRecord | null {
  const data = (snapshot.data() ?? {}) as PortfolioFirestoreDoc;
  if (!isPreviewCardDoc(data)) return null;

  const title = normalizeString(data.title);
  const slug = normalizeString(data.slug) ?? snapshot.id;
  const image = normalizeString(data.image);
  const platforms = normalizeStringList<PortfolioPlatform>(
    data.platforms,
    PORTFOLIO_PLATFORM_VALUES,
  );
  const categories = normalizeStringList<PortfolioCategory>(
    data.categories,
    PORTFOLIO_CATEGORY_VALUES,
  );

  if (!title || !image || platforms.length === 0 || categories.length === 0) {
    return null;
  }

  return {
    id: slug,
    slug,
    title,
    image,
    imagePath: normalizeString(data.imagePath),
    platforms,
    categories,
    isPublished: data.isPublished !== false,
    createdAt: normalizeIsoTimestamp(data.createdAt),
    updatedAt: normalizeIsoTimestamp(data.updatedAt),
    updatedBy: normalizeString(data.updatedBy),
    updatedByProfile: null,
  };
}

function comparePreviewRecords(
  left: ManagedPortfolioPreviewProjectRecord,
  right: ManagedPortfolioPreviewProjectRecord,
): number {
  const leftTime = left.createdAt ? Date.parse(left.createdAt) : 0;
  const rightTime = right.createdAt ? Date.parse(right.createdAt) : 0;

  if (leftTime !== rightTime) {
    return rightTime - leftTime;
  }

  return left.slug.localeCompare(right.slug);
}

export async function listManagedPortfolioPreviewProjects(): Promise<
  ManagedPortfolioPreviewProjectRecord[]
> {
  const firestore = getFirestoreDb();

  try {
    const snapshot = await firestore
      .collection(PORTFOLIO_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();
    const records = snapshot.docs
      .map((doc) => toManagedPreviewRecord(doc))
      .filter((item): item is ManagedPortfolioPreviewProjectRecord => item !== null)
      .sort(comparePreviewRecords);

    return attachUpdatedByProfiles(records);
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load portfolio preview cards', {
      cause,
    });
  }
}

export async function listPublicPortfolioPreviewProjects(): Promise<PortfolioPreviewProjectItem[]> {
  const records = await listManagedPortfolioPreviewProjects();

  return records
    .filter((item) => item.isPublished)
    .map(({ image, title, platforms, slug, categories }) => ({
      image,
      title,
      platforms,
      id: slug,
      categories,
    }));
}

export async function createManagedPortfolioPreviewProject(
  input: CreateAdminPortfolioPreviewProjectInput,
): Promise<ManagedPortfolioPreviewProjectRecord> {
  const firestore = getFirestoreDb();
  const { imagePath, imageUrl } = await resolvePortfolioImageUrl(input.image);
  const baseSlug = buildPortfolioSlugFromTitle(input.title);

  try {
    return await firestore.runTransaction(async (tx) => {
      let candidateSlug = baseSlug;
      let sequence = 1;
      let docRef = firestore.collection(PORTFOLIO_COLLECTION).doc(candidateSlug);
      let snapshot = await tx.get(docRef);

      while (snapshot.exists) {
        sequence += 1;
        candidateSlug = `${baseSlug}-${sequence}`;
        docRef = firestore.collection(PORTFOLIO_COLLECTION).doc(candidateSlug);
        snapshot = await tx.get(docRef);
      }

      tx.set(docRef, {
        title: input.title,
        slug: candidateSlug,
        image: imageUrl,
        imagePath,
        platforms: input.platforms,
        categories: input.categories,
        isPublished: true,
        entryType: PORTFOLIO_PREVIEW_ENTRY_TYPE,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: input.adminUid,
      });

      return {
        id: candidateSlug,
        slug: candidateSlug,
        title: input.title,
        image: imageUrl,
        imagePath,
        platforms: input.platforms,
        categories: input.categories,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: input.adminUid,
        updatedByProfile: await getAdminUserProfileByUid(input.adminUid),
      };
    });
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to create portfolio preview card', {
      cause,
    });
  }
}

export async function deleteManagedPortfolioPreviewProject(input: {
  projectId: string;
}): Promise<void> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(PORTFOLIO_COLLECTION).doc(input.projectId);

  try {
    const snapshot = await docRef.get();
    const record = snapshot.exists ? toManagedPreviewRecord(snapshot) : null;

    if (!snapshot.exists || !record) {
      throw ApiError.fromCode(
        'BAD_REQUEST',
        `Portfolio preview project "${input.projectId}" not found`,
      );
    }

    await docRef.delete();
    // Best-effort cleanup keeps card deletion reliable even if storage cleanup is temporarily down.
    await deletePortfolioImage(record.imagePath).catch(() => undefined);
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to delete portfolio preview card', {
      cause,
    });
  }
}

export async function countEffectivePortfolioItems(): Promise<number> {
  const firestore = getFirestoreDb();

  try {
    const snapshot = await firestore.collection(PORTFOLIO_COLLECTION).get();

    return snapshot.docs.reduce((count, doc) => {
      const data = doc.data() as PortfolioFirestoreDoc;
      const isPublished = data.isPublished !== false;
      return isPublished ? count + 1 : count;
    }, 0);
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to count portfolio items', {
      cause,
    });
  }
}
