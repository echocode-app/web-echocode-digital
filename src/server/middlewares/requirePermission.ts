import { type AuthContext } from '@/server/middlewares/requireAuth';
import { hasPermission, isRole, type Permission } from '@/server/auth/roles';
import { ApiError } from '@/server/lib/errors';

type RequiredPermission = Permission;
type PermissionMode = 'all' | 'any';

/** Enforces permission checks using role-permission mapping from the auth context */
export function requirePermission(
  authContext: AuthContext,
  permissions: RequiredPermission | readonly RequiredPermission[],
  mode: PermissionMode = 'all',
): void {
  const role = authContext.role;
  if (!role || !isRole(role)) {
    throw ApiError.fromCode('PERMISSION_DENIED', 'Role is missing or invalid');
  }

  const requested = Array.isArray(permissions) ? permissions : [permissions];
  if (requested.length === 0) {
    throw ApiError.fromCode('BAD_REQUEST', 'Permissions list must not be empty');
  }

  const evaluator = mode === 'any' ? 'some' : 'every';
  const granted = requested[evaluator]((permission) => hasPermission(role, permission));

  if (!granted) {
    throw ApiError.fromCode(
      'PERMISSION_DENIED',
      `Missing required permissions (${mode}): ${requested.join(', ')}`,
    );
  }
}
