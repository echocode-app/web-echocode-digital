import type { Auth, DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { getAuth } from 'firebase-admin/auth';
import { ApiError } from '@/server/lib/errors';
import { getFirebaseAdminApp } from '@/server/firebase/app';
import { assertServerOnly } from '@/server/lib/serverOnly';

// Revocation-sensitive auth utilities must never leak into client bundles.
assertServerOnly('src/server/firebase/auth');

/** Returns the singleton Firebase Auth admin client. */
export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export type FirebaseDecodedIdToken = DecodedIdToken;

/** Verifies an ID token and enforces revocation checks for privileged APIs. */
export async function verifyFirebaseIdToken(
  token: string,
  checkRevoked = true,
): Promise<DecodedIdToken> {
  try {
    return await getFirebaseAuth().verifyIdToken(token, checkRevoked);
  } catch (cause) {
    const errorCode =
      cause && typeof cause === 'object' && 'code' in cause
        ? String((cause as { code: unknown }).code)
        : '';
    const isAuthFailure =
      errorCode.startsWith('auth/invalid-') ||
      errorCode === 'auth/id-token-expired' ||
      errorCode === 'auth/id-token-revoked' ||
      errorCode === 'auth/argument-error';

    throw ApiError.fromCode(
      isAuthFailure ? 'AUTH_INVALID_TOKEN' : 'FIREBASE_UNAVAILABLE',
      isAuthFailure
        ? 'Invalid, expired, or revoked token'
        : 'Firebase Auth verification service is unavailable',
      { publicMessage: isAuthFailure ? 'Unauthorized' : 'Service unavailable', cause },
    );
  }
}

export async function getFirebaseUser(uid: string): Promise<UserRecord> {
  try {
    return await getFirebaseAuth().getUser(uid);
  } catch (cause) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Failed to load Firebase user',
      { cause },
    );
  }
}

export async function setFirebaseCustomUserClaims(
  uid: string,
  claims: Record<string, unknown>,
): Promise<void> {
  try {
    await getFirebaseAuth().setCustomUserClaims(uid, claims);
  } catch (cause) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Failed to update Firebase custom claims',
      { cause },
    );
  }
}

export async function listFirebaseUsers(): Promise<UserRecord[]> {
  try {
    const users: UserRecord[] = [];
    let pageToken: string | undefined;

    do {
      const page = await getFirebaseAuth().listUsers(1000, pageToken);
      users.push(...page.users);
      pageToken = page.pageToken;
    } while (pageToken);

    return users;
  } catch (cause) {
    throw ApiError.fromCode(
      'FIREBASE_UNAVAILABLE',
      'Failed to list Firebase users',
      { cause },
    );
  }
}

export function isFirebaseAuthAvailable(): boolean {
  try {
    getFirebaseAuth();
    return true;
  } catch (cause) {
    throw ApiError.fromCode(
      'FIREBASE_UNAVAILABLE',
      'Firebase Auth service is unavailable',
      { cause },
    );
  }
}
