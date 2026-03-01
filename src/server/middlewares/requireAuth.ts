import {
  bootstrapAdminIfAllowed,
  extractIdToken,
  getAuthenticatedUserProfile,
  verifyIdToken,
} from '@/server/auth/auth.service';
import { ApiError } from '@/server/lib/errors';
import { isRole, type Role } from '@/server/auth/roles';

/** Authenticated request context derived from a verified Firebase ID token */
export type AuthContext = {
  uid: string;
  email: string | null;
  claims: Awaited<ReturnType<typeof verifyIdToken>>['claims'];
  role: Role | null;
};

/** Verifies bearer token and returns normalized auth context for handlers/services */
type RequireAuthOptions = {
  bootstrapAdmin?: boolean;
};

export async function requireAuth(
  request: Pick<Request, 'headers'>,
  options: RequireAuthOptions = {},
): Promise<AuthContext> {
  try {
    const token = extractIdToken(request);
    const verified = await verifyIdToken(token);
    let roleClaim = verified.claims.role;
    let role = isRole(roleClaim) ? roleClaim : null;

    if (!role && options.bootstrapAdmin) {
      // Custom claims propagation to client tokens is async; clients should refresh ID token after first login.
      await bootstrapAdminIfAllowed(verified.uid, verified.email);
      const profile = await getAuthenticatedUserProfile(verified.uid);
      role = profile.role;
      roleClaim = role;
    }

    return {
      uid: verified.uid,
      email: verified.email ?? null,
      claims: {
        ...verified.claims,
        role: roleClaim,
      },
      role,
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('AUTH_INVALID_TOKEN', 'Invalid or expired token', { cause });
  }
}
