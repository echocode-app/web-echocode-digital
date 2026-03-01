import { env } from '@/server/config/env';

export type Role = 'admin' | 'developer' | 'manager';

export type Permission =
  | 'admin.access'
  | 'admin.settings'
  | 'admin.logs.read'
  | 'submissions.read'
  | 'submissions.update'
  | 'vacancies.manage'
  | 'portfolio.manage'
  | 'audit.read';

export const ADMIN_ACCESS_PERMISSION = 'admin.access';
const ALL_ADMIN_PERMISSIONS: readonly Permission[] = [
  'admin.access',
  'admin.settings',
  'admin.logs.read',
  'submissions.read',
  'submissions.update',
  'vacancies.manage',
  'portfolio.manage',
  'audit.read',
];

const MANAGER_ALLOWED_PERMISSIONS: readonly Permission[] = [
  'admin.access',
  'submissions.read',
  'submissions.update',
  'vacancies.manage',
  'portfolio.manage',
];

const DEVELOPER_READONLY_PERMISSIONS: readonly Permission[] = [
  'admin.access',
  'admin.logs.read',
  'submissions.read',
  'audit.read',
];

const DEVELOPER_FULL_PERMISSIONS: readonly Permission[] = [
  'admin.access',
  'admin.logs.read',
  'submissions.read',
  'submissions.update',
  'vacancies.manage',
  'portfolio.manage',
  'audit.read',
];

function resolveDeveloperPermissions(): readonly Permission[] {
  // Development can use explicit full permissions for faster local delivery.
  if (env.nodeEnv === 'development') return DEVELOPER_FULL_PERMISSIONS;

  // Security-critical: production must never grant elevated developer scope by default.
  if (env.nodeEnv === 'production') return DEVELOPER_READONLY_PERMISSIONS;

  return env.developerAccessMode === 'full'
    ? DEVELOPER_FULL_PERMISSIONS
    : DEVELOPER_READONLY_PERMISSIONS;
}

const developerPermissions = resolveDeveloperPermissions();

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: ALL_ADMIN_PERMISSIONS,
  developer: developerPermissions,
  // Manager has explicit business permissions and cannot auto-inherit future sensitive scopes.
  manager: MANAGER_ALLOWED_PERMISSIONS,
};

/** Runtime guard for role claims coming from external token/user payloads */
export function isRole(value: unknown): value is Role {
  return value === 'admin' || value === 'developer' || value === 'manager';
}

/** Evaluates role permissions using explicit role-to-scope mapping */
export function hasPermission(
  role: Role,
  permission: Permission,
): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}
