'use client';

import { useState } from 'react';
import { SelectChevron } from '@/components/admin/client-submissions/shared/clientSubmissions.icons';

import {
  ADMIN_ACCESS_INPUT_CLASS_NAME,
  ADMIN_ACCESS_LABEL_CLASS_NAME,
  ADMIN_ACCESS_ROLE_OPTIONS,
  ADMIN_ACCESS_SELECT_CLASS_NAME,
} from '@/components/admin/settings/adminAccess.constants';
import type { CreateAdminAccessInput } from '@/server/admin';

type AdminAccessInviteFormProps = {
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: (input: CreateAdminAccessInput) => Promise<void>;
};

export default function AdminAccessInviteForm({
  disabled,
  isSubmitting,
  onSubmit,
}: AdminAccessInviteFormProps) {
  const [form, setForm] = useState<CreateAdminAccessInput>({
    email: '',
    displayName: '',
    position: '',
    role: 'manager',
  });

  return (
    <form
      className="grid gap-3 lg:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(form);
        setForm({
          email: '',
          displayName: '',
          position: '',
          role: 'manager',
        });
      }}
    >
      <label>
        <span className={ADMIN_ACCESS_LABEL_CLASS_NAME}>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className={ADMIN_ACCESS_INPUT_CLASS_NAME}
          placeholder="Enter email"
          disabled={disabled || isSubmitting}
          required
        />
      </label>

      <label>
        <span className={ADMIN_ACCESS_LABEL_CLASS_NAME}>Name</span>
        <input
          type="text"
          value={form.displayName}
          onChange={(event) =>
            setForm((current) => ({ ...current, displayName: event.target.value }))
          }
          className={ADMIN_ACCESS_INPUT_CLASS_NAME}
          placeholder="Enter name"
          disabled={disabled || isSubmitting}
          required
        />
      </label>

      <label>
        <span className={ADMIN_ACCESS_LABEL_CLASS_NAME}>Position</span>
        <input
          type="text"
          value={form.position}
          onChange={(event) => setForm((current) => ({ ...current, position: event.target.value }))}
          className={ADMIN_ACCESS_INPUT_CLASS_NAME}
          placeholder="Enter position"
          disabled={disabled || isSubmitting}
          required
        />
      </label>

      <label>
        <span className={ADMIN_ACCESS_LABEL_CLASS_NAME}>Role</span>
        <div className="relative">
          <select
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role: event.target.value as CreateAdminAccessInput['role'],
              }))
            }
            className={ADMIN_ACCESS_SELECT_CLASS_NAME}
            disabled={disabled || isSubmitting}
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

      <div className="lg:col-span-2">
        <p className="font-main text-main-xs text-gray60">
          Access is granted by email before the first login.
        </p>
      </div>

      <div className="lg:col-span-2">
        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="
            rounded-base
            border-2 border-accent
            px-6 py-2
            font-title text-title-sm uppercase
            shadow-button
            transition duration-main
            hover:bg-accent
            disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          {isSubmitting ? 'Saving...' : 'Invite user'}
        </button>
      </div>
    </form>
  );
}
