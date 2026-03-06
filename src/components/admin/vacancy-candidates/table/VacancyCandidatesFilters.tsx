import { SelectChevron } from '@/components/admin/client-submissions/shared/clientSubmissions.icons';
import { CLIENT_SUBMISSION_STATUS_OPTIONS } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';
import type { VacancySubmissionStatus } from '@/server/forms/vacancy-submission/vacancySubmission.types';

type VacancyOption = {
  value: string;
  label: string;
};

type VacancyCandidatesFiltersProps = {
  statusFilter: string;
  vacancyKeyFilter: string;
  dateFrom: string;
  dateTo: string;
  vacancyOptions: VacancyOption[];
  onStatusFilterChange: (value: string) => void;
  onVacancyKeyFilterChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApply: () => void;
};

export default function VacancyCandidatesFilters({
  statusFilter,
  vacancyKeyFilter,
  dateFrom,
  dateTo,
  vacancyOptions,
  onStatusFilterChange,
  onVacancyKeyFilterChange,
  onDateFromChange,
  onDateToChange,
  onApply,
}: VacancyCandidatesFiltersProps) {
  const todayIso = new Date().toISOString().slice(0, 10);

  const openDatePicker = (target: EventTarget | null) => {
    if (!(target instanceof HTMLInputElement)) return;
    if (typeof target.showPicker === 'function') {
      target.showPicker();
    }
  };

  return (
    <article className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label htmlFor="vacancy-candidates-status-filter" className="mb-1 block font-main text-main-xs text-gray60">
            Status
          </label>
          <div className="relative">
            <select
              id="vacancy-candidates-status-filter"
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              aria-label="Filter candidate submissions by status"
              title="Filter candidate submissions by status"
              className="w-full appearance-none rounded-(--radius-secondary) border border-gray16 bg-black/30 px-3 py-2 pr-12 font-main text-main-sm text-white outline-none"
            >
              <option value="">All</option>
              {CLIENT_SUBMISSION_STATUS_OPTIONS.map((status: VacancySubmissionStatus) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center">
              <SelectChevron />
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="vacancy-candidates-vacancy-filter" className="mb-1 block font-main text-main-xs text-gray60">
            Vacancy
          </label>
          <div className="relative">
            <select
              id="vacancy-candidates-vacancy-filter"
              value={vacancyKeyFilter}
              onChange={(event) => onVacancyKeyFilterChange(event.target.value)}
              aria-label="Filter candidate submissions by vacancy"
              title="Filter candidate submissions by vacancy"
              className="w-full appearance-none rounded-(--radius-secondary) border border-gray16 bg-black/30 px-3 py-2 pr-12 font-main text-main-sm text-white outline-none"
            >
              <option value="">All</option>
              {vacancyOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-4 flex items-center">
              <SelectChevron />
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="vacancy-candidates-date-from" className="mb-1 block font-main text-main-xs text-gray60">
            Date from
          </label>
          <input
            id="vacancy-candidates-date-from"
            type="date"
            value={dateFrom}
            onChange={(event) => onDateFromChange(event.target.value)}
            onClick={(event) => openDatePicker(event.currentTarget)}
            onFocus={(event) => openDatePicker(event.currentTarget)}
            aria-label="Filter candidate submissions from date"
            title="Filter candidate submissions from date"
            max={dateTo || todayIso}
            className="w-full cursor-pointer rounded-(--radius-secondary) border border-gray16 bg-black/30 px-3 py-2 font-main text-main-sm text-white outline-none"
          />
        </div>

        <div>
          <label htmlFor="vacancy-candidates-date-to" className="mb-1 block font-main text-main-xs text-gray60">
            Date to
          </label>
          <input
            id="vacancy-candidates-date-to"
            type="date"
            value={dateTo}
            onChange={(event) => onDateToChange(event.target.value)}
            onClick={(event) => openDatePicker(event.currentTarget)}
            onFocus={(event) => openDatePicker(event.currentTarget)}
            aria-label="Filter candidate submissions to date"
            title="Filter candidate submissions to date"
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
