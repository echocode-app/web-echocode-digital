import { FieldValue, Timestamp } from 'firebase-admin/firestore';

import type { Role } from '@/server/auth/roles';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import type {
  AdminAccessEntryDto,
  AdminAccessSource,
  AdminAccessStatus,
} from '@/server/admin/access/adminAccess.types';

const ADMIN_ACCESS_COLLECTION = 'admin_access';

type AdminAccessDoc = {
  email: string;
  normalizedEmail: string;
  displayName: string | null;
  position: string | null;
  role: Role;
  status: AdminAccessStatus;
  source: AdminAccessSource;
  uid: string | null;
  invitedByUid: string | null;
  invitedByEmail: string | null;
  updatedByUid: string | null;
  updatedByEmail: string | null;
  createdAt: FieldValue | Timestamp;
  updatedAt: FieldValue | Timestamp;
  lastLoginAt: FieldValue | Timestamp | null;
};

type PersistAdminAccessInput = {
  email: string;
  normalizedEmail: string;
  displayName: string | null;
  position: string | null;
  role: Role;
  status: AdminAccessStatus;
  source: AdminAccessSource;
  uid: string | null;
  invitedByUid: string | null;
  invitedByEmail: string | null;
  updatedByUid: string | null;
  updatedByEmail: string | null;
  preserveCreatedAt?: boolean;
  markLoginAt?: boolean;
};

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toIsoString(value: unknown): string | null {
  return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

function toDto(data: FirebaseFirestore.DocumentData): AdminAccessEntryDto {
  return {
    email: typeof data.email === 'string' ? data.email : '',
    normalizedEmail: typeof data.normalizedEmail === 'string' ? data.normalizedEmail : '',
    displayName: normalizeOptionalString(data.displayName),
    position: normalizeOptionalString(data.position),
    role: data.role as Role,
    status: data.status as AdminAccessStatus,
    source: data.source as AdminAccessSource,
    uid: normalizeOptionalString(data.uid),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    lastLoginAt: toIsoString(data.lastLoginAt),
  };
}

export function normalizeAdminAccessEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getAdminAccessEntryByEmail(
  normalizedEmail: string,
): Promise<AdminAccessEntryDto | null> {
  try {
    const snapshot = await getFirestoreDb()
      .collection(ADMIN_ACCESS_COLLECTION)
      .doc(normalizedEmail)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    const data = snapshot.data();
    return data ? toDto(data) : null;
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load admin access entry', { cause });
  }
}

export async function listAdminAccessEntries(): Promise<AdminAccessEntryDto[]> {
  try {
    const snapshot = await getFirestoreDb()
      .collection(ADMIN_ACCESS_COLLECTION)
      .orderBy('updatedAt', 'desc')
      .get();

    return snapshot.docs
      .map((doc) => toDto(doc.data()))
      .sort((left, right) => {
        if (left.status !== right.status) {
          return left.status === 'active' ? -1 : 1;
        }

        return left.normalizedEmail.localeCompare(right.normalizedEmail);
      });
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to list admin access entries', {
      cause,
    });
  }
}

export async function persistAdminAccessEntry(input: PersistAdminAccessInput): Promise<void> {
  const payload: Partial<AdminAccessDoc> = {
    email: input.email,
    normalizedEmail: input.normalizedEmail,
    displayName: input.displayName,
    position: input.position,
    role: input.role,
    status: input.status,
    source: input.source,
    uid: input.uid,
    invitedByUid: input.invitedByUid,
    invitedByEmail: input.invitedByEmail,
    updatedByUid: input.updatedByUid,
    updatedByEmail: input.updatedByEmail,
    updatedAt: FieldValue.serverTimestamp(),
    ...(input.markLoginAt ? { lastLoginAt: FieldValue.serverTimestamp() } : {}),
  };

  if (!input.preserveCreatedAt) {
    payload.createdAt = FieldValue.serverTimestamp();
  }

  try {
    await getFirestoreDb()
      .collection(ADMIN_ACCESS_COLLECTION)
      .doc(input.normalizedEmail)
      .set(payload, { merge: true });
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to persist admin access entry', {
      cause,
    });
  }
}
