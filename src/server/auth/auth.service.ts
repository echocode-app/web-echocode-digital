import {
  getFirebaseAuth,
  type FirebaseDecodedIdToken,
  getFirebaseUser,
  setFirebaseCustomUserClaims,
} from '@/server/firebase/auth';
import { env } from '@/server/config/env';
import { ApiError } from '@/server/lib/errors';
import { isRole, type Role } from '@/server/auth/roles';
import { syncAdminAccessForLogin } from '@/server/admin/access';

/** Minimal authenticated user profile returned to API consumers */
export type AuthenticatedUserProfile = {
  uid: string;
  email: string | null;
  role: Role | null;
};

export type VerifiedAuthPayload = {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  claims: FirebaseDecodedIdToken;
};

function getFirebaseAuthErrorCode(error: unknown): string {
  if (!error || typeof error !== 'object' || !('code' in error)) return '';
  return String((error as { code: unknown }).code);
}

/**
 * Extracts Firebase ID token from Authorization header.
 * Header format: "Authorization: Bearer <ID_TOKEN>".
 */
export function extractIdToken(request: Pick<Request, 'headers'>): string {
  const authorizationHeader = request.headers.get('authorization');
  if (!authorizationHeader) {
    throw ApiError.fromCode(
      'AUTH_MISSING_TOKEN',
      'Authorization header is required for protected endpoint',
    );
  }

  const bearerPrefixMatch = authorizationHeader.match(/^Bearer\s+/i);
  if (!bearerPrefixMatch) {
    throw ApiError.fromCode(
      'AUTH_INVALID_TOKEN',
      'Authorization header must use Bearer token format',
    );
  }

  const token = authorizationHeader.slice(bearerPrefixMatch[0].length).trim();
  if (!token) {
    throw ApiError.fromCode('AUTH_MISSING_TOKEN', 'Bearer token is missing');
  }

  return token;
}

/**
 * Verifies Firebase ID token and returns normalized auth payload.
 * Revocation checks are environment-aware: disabled in development, enabled otherwise.
 */
export async function verifyIdToken(token: string): Promise<VerifiedAuthPayload> {
  if (!token.trim()) {
    throw ApiError.fromCode('AUTH_MISSING_TOKEN', 'Token is missing');
  }

  try {
    // Use strict revocation checks outside local development for safer environments.
    const checkRevoked = env.nodeEnv !== 'development';
    const decoded = await getFirebaseAuth().verifyIdToken(token, checkRevoked);

    return {
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
      claims: decoded,
    };
  } catch (cause) {
    const firebaseCode = getFirebaseAuthErrorCode(cause);
    if (firebaseCode === 'auth/id-token-revoked') {
      throw ApiError.fromCode('AUTH_REVOKED_TOKEN', 'Firebase ID token is revoked', {
        cause,
      });
    }

    throw ApiError.fromCode('AUTH_INVALID_TOKEN', 'Firebase ID token is invalid or expired', {
      cause,
    });
  }
}

/** Bootstraps developer role only for allowlisted emails that currently have no role */
export async function bootstrapAdminIfAllowed(uid: string, email?: string): Promise<void> {
  if (!email) return;

  if (!env.adminBootstrapEmails.includes(email.toLowerCase())) return;

  const user = await getFirebaseUser(uid);

  if (isRole(user.customClaims?.role)) return;

  try {
    await setFirebaseCustomUserClaims(uid, {
      ...(user.customClaims ?? {}),
      role: 'developer',
    });
    await getFirebaseUser(uid);
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('INTERNAL_ERROR', 'Failed to set Firebase custom claims', { cause });
  }
}

/** Loads latest server-trusted user profile from Firebase Admin SDK */
export async function getAuthenticatedUserProfile(uid: string): Promise<AuthenticatedUserProfile> {
  const user = await getFirebaseUser(uid);

  return {
    uid: user.uid,
    email: user.email ?? null,
    role: isRole(user.customClaims?.role) ? user.customClaims.role : null,
  };
}

export async function syncAuthenticatedAdminRole(input: {
  uid: string;
  email: string | null;
  fallbackRole: Role | null;
}): Promise<Role | null> {
  return syncAdminAccessForLogin(input);
}
