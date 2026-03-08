import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAdminUserProfileByUid } from '@/server/admin/admin-users.service';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import { VACANCY_LEVEL_VALUES } from '@/server/vacancies/vacancy.constants';
import { getPredefinedVacancyById, PREDEFINED_VACANCIES } from '@/server/vacancies/vacancy.catalog';
import type {
  ManagedVacancyDefinition,
  ManagedVacancyId,
  ManagedVacancyRecord,
  UpdateAdminVacancyInput,
  VacancyLevel,
} from '@/server/vacancies/vacancy.types';

const VACANCIES_COLLECTION = 'vacancies';

type VacancyFirestoreDoc = {
  title?: unknown;
  slug?: unknown;
  isPublished?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  location?: unknown;
  employmentType?: unknown;
  tags?: unknown;
  level?: unknown;
  isHot?: unknown;
  updatedBy?: unknown;
};

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeOptionalTimestamp(value: unknown): string | null {
  if (!(value instanceof Timestamp)) return null;
  return value.toDate().toISOString();
}

function normalizeOptionalLevel(
  value: unknown,
  fallback: VacancyLevel | null,
  hasExplicitValue: boolean,
): VacancyLevel | null {
  // Keep explicit null from admin as "no level", while still falling back for legacy docs
  // where the field has not been created yet.
  if (value == null) {
    return hasExplicitValue ? null : fallback;
  }

  const normalized = normalizeOptionalString(value);
  if (!normalized) return fallback;

  return VACANCY_LEVEL_VALUES.includes(normalized as VacancyLevel)
    ? (normalized as VacancyLevel)
    : fallback;
}

function toManagedVacancyRecord(
  definition: ManagedVacancyDefinition,
  snapshot: FirebaseFirestore.DocumentSnapshot | null,
): ManagedVacancyRecord {
  const data = (snapshot?.data() ?? {}) as VacancyFirestoreDoc;
  const hasExplicitLevel = Object.prototype.hasOwnProperty.call(data, 'level');

  return {
    vacancyId: definition.vacancyId,
    vacancySlug: normalizeOptionalString(data.slug) ?? definition.vacancySlug,
    vacancyTitle: normalizeOptionalString(data.title) ?? definition.vacancyTitle,
    conditions:
      Array.isArray(data.tags) && data.tags.every((item) => typeof item === 'string')
        ? data.tags.map((item) => item.trim()).filter(Boolean)
        : definition.conditions,
    employmentType: normalizeOptionalString(data.employmentType) ?? definition.employmentType,
    location: normalizeOptionalString(data.location) ?? definition.location,
    level: normalizeOptionalLevel(data.level, definition.defaultLevel, hasExplicitLevel),
    hotPosition: typeof data.isHot === 'boolean' ? data.isHot : definition.defaultHotPosition,
    isPublished:
      typeof data.isPublished === 'boolean' ? data.isPublished : definition.defaultPublished,
    sortOrder: definition.sortOrder,
    updatedAt: normalizeOptionalTimestamp(data.updatedAt),
    createdAt: normalizeOptionalTimestamp(data.createdAt),
    updatedBy: normalizeOptionalString(data.updatedBy),
    updatedByProfile: null,
    hasStoredConfig: Boolean(snapshot?.exists),
  };
}

async function attachUpdatedByProfiles(
  records: ManagedVacancyRecord[],
): Promise<ManagedVacancyRecord[]> {
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

async function readVacancySnapshots(): Promise<
  Map<ManagedVacancyId, FirebaseFirestore.DocumentSnapshot>
> {
  const firestore = getFirestoreDb();

  try {
    const entries = await Promise.all(
      PREDEFINED_VACANCIES.map(async (definition) => {
        const snapshot = await firestore
          .collection(VACANCIES_COLLECTION)
          .doc(definition.vacancyId)
          .get();

        return [definition.vacancyId, snapshot] as const;
      }),
    );

    return new Map(entries);
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load managed vacancies', { cause });
  }
}

function buildCreateDoc(definition: ManagedVacancyDefinition): Record<string, unknown> {
  return {
    title: definition.vacancyTitle,
    slug: definition.vacancySlug,
    isPublished: definition.defaultPublished,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    location: definition.location,
    employmentType: definition.employmentType,
    tags: definition.conditions,
    level: definition.defaultLevel,
    isHot: definition.defaultHotPosition,
    updatedBy: null,
  };
}

export async function listManagedVacancyRecords(): Promise<ManagedVacancyRecord[]> {
  const snapshots = await readVacancySnapshots();

  const records = PREDEFINED_VACANCIES.map((definition) =>
    toManagedVacancyRecord(definition, snapshots.get(definition.vacancyId) ?? null),
  );

  return attachUpdatedByProfiles(records);
}

export async function getManagedVacancyRecordBySlug(
  slug: string,
): Promise<ManagedVacancyRecord | null> {
  const normalized = slug.trim().toLowerCase();
  const definition =
    PREDEFINED_VACANCIES.find(
      (item) => item.vacancySlug === normalized || item.vacancyId === normalized,
    ) ?? null;

  if (!definition) return null;

  const firestore = getFirestoreDb();

  try {
    const snapshot = await firestore
      .collection(VACANCIES_COLLECTION)
      .doc(definition.vacancyId)
      .get();

    const record = toManagedVacancyRecord(definition, snapshot);
    return (await attachUpdatedByProfiles([record]))[0] ?? record;
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load vacancy details', { cause });
  }
}

export async function updateManagedVacancyRecord(
  input: UpdateAdminVacancyInput,
): Promise<ManagedVacancyRecord> {
  const firestore = getFirestoreDb();
  const definition = getPredefinedVacancyById(input.vacancyId);
  const docRef = firestore.collection(VACANCIES_COLLECTION).doc(input.vacancyId);

  try {
    return await firestore.runTransaction(async (tx) => {
      const snapshot = await tx.get(docRef);

      if (!snapshot.exists) {
        tx.set(docRef, buildCreateDoc(definition));
      }

      const patch: Record<string, unknown> = {
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: input.adminUid,
      };

      if (typeof input.isPublished === 'boolean') {
        patch.isPublished = input.isPublished;
      }

      if (typeof input.hotPosition === 'boolean') {
        patch.isHot = input.hotPosition;
      }

      if (Object.prototype.hasOwnProperty.call(input, 'level')) {
        patch.level = input.level ?? null;
      }

      tx.set(
        docRef,
        {
          title: definition.vacancyTitle,
          slug: definition.vacancySlug,
          location: definition.location,
          employmentType: definition.employmentType,
          tags: definition.conditions,
          ...patch,
        },
        { merge: true },
      );

      const currentRecord = toManagedVacancyRecord(definition, snapshot);

      return {
        ...currentRecord,
        isPublished:
          typeof input.isPublished === 'boolean' ? input.isPublished : currentRecord.isPublished,
        hotPosition:
          typeof input.hotPosition === 'boolean' ? input.hotPosition : currentRecord.hotPosition,
        level: Object.prototype.hasOwnProperty.call(input, 'level')
          ? (input.level ?? null)
          : currentRecord.level,
        updatedAt: new Date().toISOString(),
        createdAt: currentRecord.createdAt ?? new Date().toISOString(),
        updatedBy: input.adminUid,
        updatedByProfile: await getAdminUserProfileByUid(input.adminUid),
        hasStoredConfig: true,
      };
    });
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to update vacancy settings', { cause });
  }
}
