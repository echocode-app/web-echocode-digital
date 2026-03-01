import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import { SelectChevron } from '@/components/admin/client-submissions/shared/clientSubmissions.icons';
import { CLIENT_SUBMISSION_STATUS_OPTIONS } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';

type ClientSubmissionsFiltersProps = {
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  onStatusFilterChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApply: () => void;
};

export default function ClientSubmissionsFilters({
  statusFilter,
  dateFrom,
  dateTo,
  onStatusFilterChange,
  onDateFromChange,
  onDateToChange,
  onApply,
}: ClientSubmissionsFiltersProps) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const openDatePicker = (target: EventTarget | null) => {
    if (!(target instanceof HTMLInputElement)) return;
    if (typeof target.showPicker === 'function') {
      target.showPicker();
    }
  };

  return (
    <article className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label htmlFor="client-submissions-status-filter" className="mb-1 block font-main text-main-xs text-gray60">
            Status
          </label>
          <div className="relative">
            <select
              id="client-submissions-status-filter"
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              aria-label="Filter submissions by status"
              title="Filter submissions by status"
              className="w-full appearance-none rounded-(--radius-secondary) border border-gray16 bg-black/30 px-3 py-2 pr-12 font-main text-main-sm text-white outline-none"
            >
              <option value="">All</option>
              {CLIENT_SUBMISSION_STATUS_OPTIONS.map((status: ClientSubmissionStatus) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center">
              <SelectChevron />
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="client-submissions-date-from" className="mb-1 block font-main text-main-xs text-gray60">
            Date from
          </label>
          <input
            id="client-submissions-date-from"
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            onClick={(event) => openDatePicker(event.currentTarget)}
            onFocus={(event) => openDatePicker(event.currentTarget)}
            aria-label="Filter submissions from date"
            title="Filter submissions from date"
            max={dateTo || todayIso}
            className="w-full cursor-pointer rounded-(--radius-secondary) border border-gray16 bg-black/30 px-3 py-2 font-main text-main-sm text-white outline-none"
          />
        </div>

        <div>
          <label htmlFor="client-submissions-date-to" className="mb-1 block font-main text-main-xs text-gray60">
            Date to
          </label>
          <input
            id="client-submissions-date-to"
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            onClick={(event) => openDatePicker(event.currentTarget)}
            onFocus={(event) => openDatePicker(event.currentTarget)}
            aria-label="Filter submissions to date"
            title="Filter submissions to date"
            min={dateFrom || undefined}
            max={todayIso}
            className="w-full cursor-pointer rounded-(--radius-secondary) border border-gray16 bg-black/30 px-3 py-2 font-main text-main-sm text-white outline-none"
          />
        </div>

        <div className="flex h-full flex-col">
          <span className="mb-1 block select-none font-main text-main-xs text-transparent">Apply</span>
          <button
            type="button"
            onClick={onApply}
            className="w-full rounded-(--radius-secondary) border border-accent px-3 py-2 font-title text-title-xs uppercase text-white transition duration-main hover:bg-accent"
          >
            Apply
          </button>
        </div>
      </div>
    </article>
  );
}
