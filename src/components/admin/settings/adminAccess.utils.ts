import type { AdminToastState } from '@/components/admin/ui/AdminToast';
import type { AdminAccessEntryDto, UpdateAdminAccessInput } from '@/server/admin';

export type AdminAccessDraftByEmail = Record<string, UpdateAdminAccessInput>;

export function buildAdminAccessToast(
  id: number,
  tone: NonNullable<AdminToastState>['tone'],
  message: string,
) {
  return { id, tone, message } satisfies NonNullable<AdminToastState>;
}

export function getAdminAccessRoleChipClass(role: AdminAccessEntryDto['role']): string {
  if (role === 'admin') return 'border-accent/40 bg-accent/12 text-accent';
  if (role === 'developer') return 'border-[#5aa9ff]/40 bg-[#5aa9ff]/12 text-[#9cc9ff]';
  return 'border-[#ffd38e]/45 bg-[#ffd38e]/12 text-[#ffd38e]';
}

export function getAdminAccessStatusChipClass(status: AdminAccessEntryDto['status']): string {
  return status === 'active'
    ? 'border-[#3ecf8e]/40 bg-[#3ecf8e]/10 text-[#7ef0b4]'
    : 'border-[#ff6d7a]/40 bg-[#ff6d7a]/10 text-[#ff9ca6]';
}

export function createAdminAccessDraft(entry: AdminAccessEntryDto): UpdateAdminAccessInput {
  return {
    displayName: entry.displayName,
    position: entry.position,
    role: entry.role,
    status: entry.status,
  };
}
