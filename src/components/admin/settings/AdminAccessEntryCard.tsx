'use client';

import { SelectChevron } from '@/components/admin/client-submissions/shared/clientSubmissions.icons';
import { formatDateTime } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';
import {
  ADMIN_ACCESS_INPUT_CLASS_NAME,
  ADMIN_ACCESS_LABEL_CLASS_NAME,
  ADMIN_ACCESS_ROLE_OPTIONS,
  ADMIN_ACCESS_SELECT_CLASS_NAME,
} from '@/components/admin/settings/adminAccess.constants';
import {
  getAdminAccessRoleChipClass,
  getAdminAccessStatusChipClass,
} from '@/components/admin/settings/adminAccess.utils';
import type { AdminAccessEntryDto, UpdateAdminAccessInput } from '@/server/admin';

type AdminAccessEntryCardProps = {
  entry: AdminAccessEntryDto;
  draft: UpdateAdminAccessInput;
  disabled: boolean;
  isSaving: boolean;
  onDraftChange: (next: UpdateAdminAccessInput) => void;
  onSave: () => Promise<void>;
};

export default function AdminAccessEntryCard({
  entry,
  draft,
  disabled,
  isSaving,
  onDraftChange,
  onSave,
}: AdminAccessEntryCardProps) {
  const isDirty =
    draft.displayName !== entry.displayName ||
    draft.position !== entry.position ||
    draft.role !== entry.role ||
    draft.status !== entry.status;
  const updatedAt = entry.updatedAt ? formatDateTime(entry.updatedAt) : null;
  const lastLoginAt = entry.lastLoginAt ? formatDateTime(entry.lastLoginAt) : null;

  return (
    <article
      className="
        rounded-(--radius-secondary)
        border border-gray16
        bg-black/20
        p-4
      "
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="break-all font-main text-main-sm font-semibold text-white">
            {entry.email}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 font-main text-[10px] uppercase tracking-[0.12em] ${getAdminAccessRoleChipClass(entry.role)}`}
            >
              {entry.role}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 font-main text-[10px] uppercase tracking-[0.12em] ${getAdminAccessStatusChipClass(entry.status)}`}
            >
              {entry.status}
            </span>
            <span className="rounded-full border border-gray16 bg-gray10 px-2 py-0.5 font-main text-[10px] uppercase tracking-[0.12em] text-gray60">
              {entry.source}
            </span>
          </div>
          <div className="mt-3 grid gap-1 font-main text-main-xs text-gray60">
            <p>UID: {entry.uid ?? 'Not linked yet'}</p>
            <p>
              Updated:{' '}
              {updatedAt ? `${updatedAt.date} ${updatedAt.time}` : 'Unknown'}
            </p>
            <p>
              Last login:{' '}
              {lastLoginAt ? `${lastLoginAt.date} ${lastLoginAt.time}` : 'No login yet'}
            </p>
          </div>
        </div>

        <div className="grid gap-3 xl:min-w-92 xl:max-w-92">
          <label>
            <span className={ADMIN_ACCESS_LABEL_CLASS_NAME}>Name</span>
            <input
              type="text"
              value={draft.displayName ?? ''}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  displayName: event.target.value || null,
                })
              }
              className={ADMIN_ACCESS_INPUT_CLASS_NAME}
              placeholder="Enter name"
              disabled={disabled || isSaving}
            />
          </label>

          <label>
            <span className={ADMIN_ACCESS_LABEL_CLASS_NAME}>Position</span>
            <input
              type="text"
              value={draft.position ?? ''}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  position: event.target.value || null,
                })
              }
              className={ADMIN_ACCESS_INPUT_CLASS_NAME}
              placeholder="Enter position"
              disabled={disabled || isSaving}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className={ADMIN_ACCESS_LABEL_CLASS_NAME}>Role</span>
              <div className="relative">
                <select
                  value={draft.role}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      role: event.target.value as UpdateAdminAccessInput['role'],
                    })
                  }
                  className={ADMIN_ACCESS_SELECT_CLASS_NAME}
                  disabled={disabled || isSaving}
                >
                  {ADMIN_ACCESS_ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <SelectChevron />
                </span>
              </div>
            </label>

            <label>
              <span className={ADMIN_ACCESS_LABEL_CLASS_NAME}>Status</span>
              <div className="relative">
                <select
                  value={draft.status}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      status: event.target.value as UpdateAdminAccessInput['status'],
                    })
                  }
                  className={ADMIN_ACCESS_SELECT_CLASS_NAME}
                  disabled={disabled || isSaving}
                >
                  <option value="active">Active</option>
                  <option value="revoked">Revoked</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <SelectChevron />
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => void onSave()}
              disabled={disabled || isSaving || !isDirty}
              className="
                rounded-(--radius-secondary)
                border border-gray16
                px-4 py-2
                font-main text-main-sm text-white
                transition duration-main
                hover:border-accent hover:text-accent
                disabled:cursor-not-allowed disabled:opacity-40
              "
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
