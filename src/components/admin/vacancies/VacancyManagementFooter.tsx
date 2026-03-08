'use client';

import type { AdminVacancyListItemDto } from '@/server/vacancies';
import type { VacancyCardState } from '@/components/admin/vacancies/shared/vacancyManagement.types';
import { getLevelLabel } from '@/components/admin/vacancies/shared/vacancyManagement.utils';

const saveButtonClassName = [
  'w-full',
  'sm:w-auto',
  'min-w-36',
  'rounded-(--radius-secondary)',
  'border',
  'border-accent',
  'px-5',
  'py-3',
  'font-title',
  'text-title-sm',
  'uppercase',
  'text-white',
  'transition',
  'duration-main',
  'hover:bg-accent',
  'disabled:cursor-not-allowed',
  'disabled:border-gray16',
  'disabled:text-gray60',
  'disabled:hover:bg-transparent',
].join(' ');

const metaTextClassName = ['font-main', 'text-main-xs', 'text-gray60', 'break-all'].join(' ');

type VacancyManagementFooterProps = {
  item: AdminVacancyListItemDto;
  draft: VacancyCardState;
  isSaving: boolean;
  isDirty: boolean;
  onSave: (vacancyId: string) => Promise<void>;
};

export default function VacancyManagementFooter({
  item,
  draft,
  isSaving,
  isDirty,
  onSave,
}: VacancyManagementFooterProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-gray16 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-main text-main-xs text-gray60">Pending result after save</p>
        <p className="mt-1 font-main text-main-sm text-white wrap-break-word">
          {draft.isPublished ? 'Published' : 'Hidden'} / {draft.hotPosition ? 'Hot' : 'Regular'} /{' '}
          {getLevelLabel(draft.level)}
        </p>
        <p className={metaTextClassName}>
          Last update:{' '}
          {item.updatedAt ? new Date(item.updatedAt).toLocaleString('en-GB') : 'Default config'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onSave(item.vacancyId)}
        disabled={!isDirty || isSaving}
        className={saveButtonClassName}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
