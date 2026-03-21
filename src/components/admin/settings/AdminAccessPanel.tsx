'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAdminSession } from '@/components/admin/AdminClientLayout';
import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import AdminAccessEntryCard from '@/components/admin/settings/AdminAccessEntryCard';
import AdminAccessInviteForm from '@/components/admin/settings/AdminAccessInviteForm';
import {
  createAdminAccessEntry,
  fetchAdminAccessList,
  updateAdminAccessEntry,
} from '@/components/admin/settings/adminAccess.api';
import { ADMIN_ACCESS_CARD_CLASS_NAME } from '@/components/admin/settings/adminAccess.constants';
import {
  buildAdminAccessToast,
  createAdminAccessDraft,
  type AdminAccessDraftByEmail,
} from '@/components/admin/settings/adminAccess.utils';
import AdminToast, { type AdminToastState } from '@/components/admin/ui/AdminToast';
import type { AdminAccessEntryDto } from '@/server/admin';

const ROLE_ACCESS_CARDS = [
  {
    role: 'Admin',
    tone: 'border-accent/40 bg-accent/6',
    points: [
      'Full access to admin settings and access management.',
      'Can review logs, submissions, vacancies and portfolio.',
      'Can invite, update, revoke and reactivate admin users.',
    ],
  },
  {
    role: 'Manager',
    tone: 'border-[#ffd38e]/45 bg-[#ffd38e]/7',
    points: [
      'Can open the admin panel and work with business sections.',
      'Can review and update submissions, vacancies and portfolio.',
      'Cannot open settings or internal admin logs.',
    ],
  },
  {
    role: 'Developer',
    tone: 'border-[#5aa9ff]/40 bg-[#5aa9ff]/7',
    points: [
      'Can open admin settings in read-only mode and view logs.',
      'Can inspect submissions and internal admin data safely.',
      'May receive elevated local-only permissions in development mode.',
    ],
  },
] as const;

export default function AdminAccessPanel() {
  const INITIAL_VISIBLE_ENTRIES = 0;
  const ACCESS_ENTRIES_PAGE_SIZE = 5;
  const { profile } = useAdminSession();
  const [entries, setEntries] = useState<AdminAccessEntryDto[]>([]);
  const [drafts, setDrafts] = useState<AdminAccessDraftByEmail>({});
  const [visibleEntriesCount, setVisibleEntriesCount] = useState(INITIAL_VISIBLE_ENTRIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingInvite, setIsSavingInvite] = useState(false);
  const [savingEmail, setSavingEmail] = useState<string | null>(null);
  const [toast, setToast] = useState<AdminToastState>(null);
  const isReadOnly = profile?.role !== 'admin';
  const canViewSettings = profile?.role === 'admin' || profile?.role === 'developer';

  useEffect(() => {
    if (!canViewSettings) {
      return;
    }

    const controller = new AbortController();

    setIsLoading(true);

    fetchAdminAccessList(controller.signal)
      .then((payload) => {
        setEntries(payload.items);
        setVisibleEntriesCount(INITIAL_VISIBLE_ENTRIES);
        setDrafts(
          payload.items.reduce<AdminAccessDraftByEmail>((accumulator, item) => {
            accumulator[item.normalizedEmail] = createAdminAccessDraft(item);
            return accumulator;
          }, {}),
        );
      })
      .catch((error) => {
        setToast(buildAdminAccessToast(Date.now(), 'error', error.message));
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [canViewSettings]);

  const sortedEntries = useMemo(
    () =>
      [...entries].sort((left, right) => {
        const leftCreatedAt = left.createdAt ? new Date(left.createdAt).getTime() : 0;
        const rightCreatedAt = right.createdAt ? new Date(right.createdAt).getTime() : 0;

        if (leftCreatedAt !== rightCreatedAt) {
          return rightCreatedAt - leftCreatedAt;
        }

        return right.email.localeCompare(left.email);
      }),
    [entries],
  );
  const visibleEntries = useMemo(
    () => sortedEntries.slice(0, visibleEntriesCount),
    [sortedEntries, visibleEntriesCount],
  );
  const hasMoreEntries = visibleEntriesCount < sortedEntries.length;

  const applyEntry = (entry: AdminAccessEntryDto) => {
    setEntries((current) => {
      const next = current.filter((item) => item.normalizedEmail !== entry.normalizedEmail);
      return [entry, ...next];
    });
    setDrafts((current) => ({
      ...current,
      [entry.normalizedEmail]: createAdminAccessDraft(entry),
    }));
  };

  if (!canViewSettings) {
    return (
      <section className="space-y-4">
        <article className={ADMIN_ACCESS_CARD_CLASS_NAME}>
          <h1 className="font-title text-title-xl text-white">Admin access</h1>
          <p className="mt-2 font-main text-main-sm text-[#ff9ca6]">
            This section is available only for admin and developer roles.
          </p>
        </article>
      </section>
    );
  }

  return (
    <>
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      <section className="space-y-4">
        <article className={ADMIN_ACCESS_CARD_CLASS_NAME}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-main text-main-xs uppercase tracking-[0.16em] text-gray60">
                Settings
              </p>
              <div className="mt-1 flex items-center gap-2">
                <h1 className="font-title text-title-xl text-white">Admin access</h1>
                <InfoTooltip
                  label="Admin access overview"
                  text="Manage who can enter the admin panel, which role they receive on first sign-in, and whether existing access stays active or revoked."
                />
              </div>
            </div>

            <div
              className={`
                rounded-(--radius-secondary)
                border px-3 py-2
                font-main text-main-xs uppercase tracking-[0.14em]
                ${isReadOnly ? 'border-[#5aa9ff]/40 bg-[#5aa9ff]/10 text-[#9cc9ff]' : 'border-accent/40 bg-accent/10 text-accent'}
              `}
            >
              {isReadOnly ? 'Read only' : 'Admin write access'}
            </div>
          </div>
        </article>

        <article className={ADMIN_ACCESS_CARD_CLASS_NAME}>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="font-title text-title-sm text-white">Invite or pre-approve user</h2>
            <InfoTooltip
              label="Invite user help"
              text="Add email, role, name and position before the first login. On the first successful Google sign-in, the selected role is applied automatically."
            />
          </div>

          <AdminAccessInviteForm
            disabled={isReadOnly}
            isSubmitting={isSavingInvite}
            onSubmit={async (input) => {
              setIsSavingInvite(true);

              try {
                const entry = await createAdminAccessEntry(input);
                applyEntry(entry);
                setToast(buildAdminAccessToast(Date.now(), 'success', 'Access entry saved.'));
              } catch (error) {
                setToast(
                  buildAdminAccessToast(
                    Date.now(),
                    'error',
                    error instanceof Error ? error.message : 'Failed to save access entry.',
                  ),
                );
              } finally {
                setIsSavingInvite(false);
              }
            }}
          />
        </article>

        <article className={ADMIN_ACCESS_CARD_CLASS_NAME}>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="font-title text-title-sm text-white">Role access comparison</h2>
            <InfoTooltip
              label="Role access comparison help"
              text="Use this summary when assigning a role. Admin has full control, manager covers business operations, and developer is intended for technical inspection and support."
            />
          </div>

          <div className="grid gap-3 xl:grid-cols-3">
            {ROLE_ACCESS_CARDS.map((card) => (
              <article
                key={card.role}
                className={`
                  rounded-(--radius-secondary)
                  border p-4
                  ${card.tone}
                `}
              >
                <h3 className="font-title text-title-xs text-white">{card.role}</h3>
                <div className="mt-3 grid gap-2 font-main text-main-xs text-gray75">
                  {card.points.map((point) => (
                    <p key={point}>{point}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className={ADMIN_ACCESS_CARD_CLASS_NAME}>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="font-title text-title-sm text-white">Existing access</h2>
            <InfoTooltip
              label="Existing access help"
              text="Admin can change role, update profile details, revoke access or re-activate an existing entry. Developer can inspect the registry in read-only mode."
            />
          </div>

          {isLoading ? (
            <div className="grid gap-3">
              <div className="h-34 animate-pulse rounded-(--radius-secondary) bg-gray10" />
              <div className="h-34 animate-pulse rounded-(--radius-secondary) bg-gray10" />
            </div>
          ) : sortedEntries.length === 0 ? (
            <p className="font-main text-main-sm text-gray60">
              No access entries yet. Add the first admin or manager above.
            </p>
          ) : (
            <div className="grid gap-3">
              {visibleEntries.map((entry) => {
                const draft = drafts[entry.normalizedEmail] ?? createAdminAccessDraft(entry);

                return (
                  <AdminAccessEntryCard
                    key={entry.normalizedEmail}
                    entry={entry}
                    draft={draft}
                    disabled={isReadOnly}
                    isSaving={savingEmail === entry.normalizedEmail}
                    onDraftChange={(next) =>
                      setDrafts((current) => ({
                        ...current,
                        [entry.normalizedEmail]: next,
                      }))
                    }
                    onSave={async () => {
                      setSavingEmail(entry.normalizedEmail);

                      try {
                        const nextEntry = await updateAdminAccessEntry(
                          entry.normalizedEmail,
                          draft,
                        );
                        applyEntry(nextEntry);
                        setToast(
                          buildAdminAccessToast(Date.now(), 'success', 'Access entry updated.'),
                        );
                      } catch (error) {
                        setToast(
                          buildAdminAccessToast(
                            Date.now(),
                            'error',
                            error instanceof Error
                              ? error.message
                              : 'Failed to update access entry.',
                          ),
                        );
                      } finally {
                        setSavingEmail(null);
                      }
                    }}
                  />
                );
              })}

              {hasMoreEntries ? (
                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => setVisibleEntriesCount((current) => current + ACCESS_ENTRIES_PAGE_SIZE)}
                    className="
                      rounded-(--radius-secondary)
                      border border-gray16
                      px-4 py-2
                      font-main text-main-sm text-gray75
                      transition duration-main
                      hover:border-accent hover:text-white
                    "
                  >
                    Load more
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </article>
      </section>
    </>
  );
}
