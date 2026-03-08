'use client';

import type { AdminVacancyListItemDto } from '@/server/vacancies';
import VacancyManagementCurrentState from '@/components/admin/vacancies/VacancyManagementCurrentState';
import VacancyManagementEditor from '@/components/admin/vacancies/VacancyManagementEditor';
import VacancyManagementFooter from '@/components/admin/vacancies/VacancyManagementFooter';
import VacancyManagementStatusBadge from '@/components/admin/vacancies/VacancyManagementStatusBadge';
import type { VacancyCardState } from '@/components/admin/vacancies/shared/vacancyManagement.types';

const cardClassName = [
  'min-w-0',
  'rounded-(--radius-base)',
  'border',
  'border-gray16',
  'bg-base-gray',
  'p-3',
  'sm:p-4',
].join(' ');

type VacancyManagementCardProps = {
  item: AdminVacancyListItemDto;
  draft: VacancyCardState;
  isSaving: boolean;
  onDraftChange: (vacancyId: string, patch: Partial<VacancyCardState>) => void;
  onSave: (vacancyId: string) => Promise<void>;
};

export default function VacancyManagementCard({
  item,
  draft,
  isSaving,
  onDraftChange,
  onSave,
}: VacancyManagementCardProps) {
  const isDirty =
    draft.isPublished !== item.isPublished ||
    draft.hotPosition !== item.hotPosition ||
    draft.level !== item.level;

  return (
    <article className={cardClassName}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="font-title text-title-base text-white">{item.vacancyTitle}</h3>
            <p className="mt-2 font-main text-main-xs uppercase tracking-[0.14em] text-gray60">
              /career/{item.vacancySlug}
            </p>
          </div>
          <VacancyManagementStatusBadge isPublished={draft.isPublished} />
        </div>

        <p className="font-main text-main-sm text-gray75">{item.conditions.join(' • ')}</p>

        <div className="grid gap-4 lg:grid-cols-2">
          <VacancyManagementEditor item={item} draft={draft} onDraftChange={onDraftChange} />
          <VacancyManagementCurrentState item={item} />
        </div>

        <VacancyManagementFooter
          item={item}
          draft={draft}
          isSaving={isSaving}
          isDirty={isDirty}
          onSave={onSave}
        />
      </div>
    </article>
  );
}
