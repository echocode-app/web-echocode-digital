'use client';

import { AdminFilterSelect } from '@/components/admin/shared/filters/AdminTableFilters';
import type { AdminVacancyListItemDto, VacancyLevel } from '@/server/vacancies';
import type { VacancyCardState } from '@/components/admin/vacancies/shared/vacancyManagement.types';

const panelClassName = [
  'min-w-0',
  'rounded-(--radius-secondary)',
  'border',
  'border-[#ffd38e]/20',
  'bg-[linear-gradient(180deg,rgba(255,211,142,0.05),rgba(0,0,0,0.10))]',
  'p-3',
].join(' ');

const toggleRowClassName = [
  'flex',
  'items-center',
  'justify-between',
  'gap-3',
  'rounded-(--radius-secondary)',
  'border',
  'border-gray16',
  'bg-black/20',
  'px-3',
  'py-2',
].join(' ');

const levelFieldClassName = [
  'min-w-0',
  'rounded-(--radius-secondary)',
  'border',
  'border-gray16',
  'bg-black/20',
  'px-3',
  'py-2',
].join(' ');

type VacancyManagementEditorProps = {
  item: AdminVacancyListItemDto;
  draft: VacancyCardState;
  onDraftChange: (vacancyId: string, patch: Partial<VacancyCardState>) => void;
};

export default function VacancyManagementEditor({
  item,
  draft,
  onDraftChange,
}: VacancyManagementEditorProps) {
  return (
    <section className={panelClassName}>
      <p className="font-main text-main-xs uppercase tracking-[0.14em] text-[#ffd38e]">
        Change values
      </p>
      <div className="mt-3 space-y-3">
        <label className={toggleRowClassName}>
          <span className="font-main text-main-sm text-white">Show on career page</span>
          <input
            type="checkbox"
            checked={draft.isPublished}
            onChange={(event) =>
              onDraftChange(item.vacancyId, { isPublished: event.target.checked })
            }
            className="h-4 w-4 accent-[#48d597]"
          />
        </label>

        <label className={toggleRowClassName}>
          <span className="font-main text-main-sm text-white">Hot position</span>
          <input
            type="checkbox"
            checked={draft.hotPosition}
            onChange={(event) =>
              onDraftChange(item.vacancyId, { hotPosition: event.target.checked })
            }
            className="h-4 w-4 accent-[#ff4f93]"
          />
        </label>

        <div className={levelFieldClassName}>
          <AdminFilterSelect
            id={`vacancy-level-${item.vacancyId}`}
            label="Candidate level"
            value={draft.level ?? ''}
            onChange={(value) =>
              onDraftChange(item.vacancyId, {
                level: value ? (value as VacancyLevel) : null,
              })
            }
          >
            <option value="">Not specified</option>
            {item.availableLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </AdminFilterSelect>
        </div>
      </div>
    </section>
  );
}
