'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminToast, { type AdminToastState } from '@/components/admin/ui/AdminToast';
import VacancyManagementCard from '@/components/admin/vacancies/VacancyManagementCard';
import VacancyManagementHeader from '@/components/admin/vacancies/VacancyManagementHeader';
import VacancyManagementSkeleton from '@/components/admin/vacancies/VacancyManagementSkeleton';
import {
  fetchAdminVacancies,
  updateAdminVacancyRequest,
} from '@/components/admin/vacancies/shared/adminVacancies.api';
import type { AdminVacancyListItemDto } from '@/server/vacancies';
import type {
  VacancyCardState,
  VacancyManagementLoadState,
} from '@/components/admin/vacancies/shared/vacancyManagement.types';
import { toVacancyCardState } from '@/components/admin/vacancies/shared/vacancyManagement.utils';

const sectionClassName = [
  'space-y-4',
  'rounded-(--radius-base)',
  'border',
  'border-gray16',
  'bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]',
  'p-3',
  'sm:p-4',
].join(' ');

const errorCardClassName = [
  'rounded-(--radius-base)',
  'border',
  'border-[#ff6d7a]/40',
  'bg-base-gray',
  'p-3',
  'sm:p-4',
  'shadow-main',
].join(' ');

export default function VacancyManagementPanel() {
  const [items, setItems] = useState<AdminVacancyListItemDto[]>([]);
  const [drafts, setDrafts] = useState<Record<string, VacancyCardState>>({});
  const [state, setState] = useState<VacancyManagementLoadState>('loading');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<AdminToastState>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchAdminVacancies(controller.signal)
      .then((payload) => {
        setItems(payload);
        setDrafts(
          Object.fromEntries(payload.map((item) => [item.vacancyId, toVacancyCardState(item)])),
        );
        setState('ready');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        setState('error');
        setToast({
          id: Date.now(),
          tone: 'error',
          message: error instanceof Error ? error.message : 'Failed to load vacancies settings.',
        });
      });

    return () => controller.abort();
  }, []);

  const visibleItems = useMemo(
    () =>
      items.map((item) => ({ item, draft: drafts[item.vacancyId] ?? toVacancyCardState(item) })),
    [drafts, items],
  );

  function updateDraft(vacancyId: string, patch: Partial<VacancyCardState>) {
    setDrafts((prev) => ({
      ...prev,
      [vacancyId]: {
        ...(prev[vacancyId] ?? { isPublished: false, hotPosition: false, level: null }),
        ...patch,
      },
    }));
  }

  async function saveVacancy(vacancyId: string) {
    const current = drafts[vacancyId];
    if (!current) return;

    setSavingId(vacancyId);

    try {
      const updated = await updateAdminVacancyRequest({
        vacancyId,
        isPublished: current.isPublished,
        hotPosition: current.hotPosition,
        level: current.level,
      });

      setItems((prev) => prev.map((item) => (item.vacancyId === vacancyId ? updated : item)));
      setDrafts((prev) => ({
        ...prev,
        [vacancyId]: toVacancyCardState(updated),
      }));
      setToast({
        id: Date.now(),
        tone: 'success',
        message: `${updated.vacancyTitle} settings updated.`,
      });
      window.dispatchEvent(new CustomEvent('admin-dashboard-refresh'));
    } catch (error: unknown) {
      setToast({
        id: Date.now(),
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to update vacancy settings.',
      });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className={sectionClassName}>
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      <VacancyManagementHeader />

      {state === 'loading' ? <VacancyManagementSkeleton /> : null}

      {state === 'error' ? (
        <article className={errorCardClassName}>
          <p className="font-main text-main-sm text-[#ff9ca6]">
            Unable to load vacancy management settings.
          </p>
        </article>
      ) : null}

      {state === 'ready' ? (
        <div className="grid gap-4">
          {visibleItems.map(({ item, draft }) => (
            <VacancyManagementCard
              key={item.vacancyId}
              item={item}
              draft={draft}
              isSaving={savingId === item.vacancyId}
              onDraftChange={updateDraft}
              onSave={saveVacancy}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
