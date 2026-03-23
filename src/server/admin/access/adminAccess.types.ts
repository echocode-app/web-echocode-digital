import { z } from 'zod';

import type { Role } from '@/server/auth/roles';

export const ADMIN_ACCESS_STATUS_VALUES = ['active', 'revoked'] as const;
export const ADMIN_ACCESS_SOURCE_VALUES = ['manual', 'bootstrap', 'claim_sync'] as const;

export type AdminAccessStatus = (typeof ADMIN_ACCESS_STATUS_VALUES)[number];
export type AdminAccessSource = (typeof ADMIN_ACCESS_SOURCE_VALUES)[number];

export type AdminAccessEntryDto = {
  email: string;
  normalizedEmail: string;
  displayName: string | null;
  position: string | null;
  role: Role;
  status: AdminAccessStatus;
  source: AdminAccessSource;
  uid: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastLoginAt: string | null;
};

export type AdminAccessListDto = {
  items: AdminAccessEntryDto[];
};

const trimmedString = z.string().trim().min(1);
const nullableTrimmedString = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable()
  .optional();

export const adminAccessRoleSchema = z.enum(['admin', 'developer', 'manager']);
export const adminAccessStatusSchema = z.enum(ADMIN_ACCESS_STATUS_VALUES);

export const createAdminAccessSchema = z.object({
  email: z.string().trim().email(),
  displayName: trimmedString.max(120),
  position: trimmedString.max(120),
  role: adminAccessRoleSchema,
});

export const updateAdminAccessSchema = z.object({
  displayName: nullableTrimmedString,
  position: nullableTrimmedString,
  role: adminAccessRoleSchema,
  status: adminAccessStatusSchema,
});

export type CreateAdminAccessInput = z.infer<typeof createAdminAccessSchema>;
export type UpdateAdminAccessInput = z.infer<typeof updateAdminAccessSchema>;
