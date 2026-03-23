import type { AdminVacancyListItemDto } from '@/server/vacancies';
import {
  getLevelLabel,
  getUpdatedByMeta,
  getUpdatedByValue,
} from '@/components/admin/vacancies/shared/vacancyManagement.utils';

const panelClassName = [
  'min-w-0',
  'rounded-(--radius-secondary)',
  'border',
  'border-gray16',
  'bg-black/20',
  'p-3',
].join(' ');

export default function VacancyManagementCurrentState({ item }: { item: AdminVacancyListItemDto }) {
  const updatedByMeta = getUpdatedByMeta(item);

  return (
    <section className={panelClassName}>
      <p className="font-main text-main-xs uppercase tracking-[0.14em] text-gray60">
        Current public state
      </p>
      <div className="mt-3 grid gap-2 font-main text-main-sm text-white">
        <p>
          Visibility:{' '}
          <span className="text-gray75">{item.isPublished ? 'Published' : 'Hidden'}</span>
        </p>
        <p>
          Hot position:{' '}
          <span className="text-gray75">{item.hotPosition ? 'Enabled' : 'Disabled'}</span>
        </p>
        <p>
          Candidate level: <span className="text-gray75">{getLevelLabel(item.level)}</span>
        </p>
        <p>
          Employment type: <span className="text-gray75">{item.employmentType}</span>
        </p>
        <div className="pt-1">
          <p>
            Last updated by: <span className="text-gray75">{getUpdatedByValue(item)}</span>
          </p>
          {updatedByMeta ? (
            <p className="mt-0.5 font-main text-main-xs text-gray60">{updatedByMeta}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
