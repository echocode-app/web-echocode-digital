import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import type {
  ModerationActorProfileDto,
  ModerationCommentDto,
} from '@/server/forms/shared/moderation.types';

const ADMIN_USERS_COLLECTION = 'admin_users';

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export async function getAdminUserProfileByUid(
  uid: string | null | undefined,
): Promise<ModerationActorProfileDto | null> {
  const normalizedUid = typeof uid === 'string' ? uid.trim() : '';
  if (!normalizedUid) {
    return null;
  }

  try {
    const snapshot = await getFirestoreDb()
      .collection(ADMIN_USERS_COLLECTION)
      .doc(normalizedUid)
      .get();
    if (!snapshot.exists) {
      return null;
    }

    const data = snapshot.data();
    if (!data) {
      return null;
    }

    return {
      uid: normalizedUid,
      displayName: normalizeOptionalString(data.displayName),
      roleLabel: normalizeOptionalString(data.roleLabel),
      email: normalizeOptionalString(data.email),
    };
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load admin user profile', { cause });
  }
}

export async function attachAdminProfilesToComments<T extends ModerationCommentDto>(
  comments: T[],
): Promise<T[]> {
  const profilesByUid = new Map<string, ModerationActorProfileDto | null>();

  await Promise.all(
    comments.map(async (comment) => {
      const uid = comment.authorUid?.trim();
      if (!uid || profilesByUid.has(uid)) return;
      profilesByUid.set(uid, await getAdminUserProfileByUid(uid));
    }),
  );

  return comments.map((comment) => ({
    ...comment,
    authorProfile: profilesByUid.get(comment.authorUid) ?? null,
  }));
}
