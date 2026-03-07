import { CLIENT_SUBMISSION_STATUS_OPTIONS } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';
import {
  AdminFilterActions,
  AdminFilterDateInput,
  AdminFilterSelect,
  AdminTableFiltersPanel,
} from '@/components/admin/shared/filters/AdminTableFilters';
import type { VacancySubmissionStatus } from '@/server/forms/vacancy-submission/vacancySubmission.types';
import { getTodayIsoInAdminTimeZone } from '@/shared/time/europeKiev';

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
  onClear: () => void;
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
  onClear,
}: VacancyCandidatesFiltersProps) {
  const todayIso = getTodayIsoInAdminTimeZone();

  return (
    <AdminTableFiltersPanel columnsClassName="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-5">
      <AdminFilterSelect
        id="vacancy-candidates-status-filter"
        label="Status"
        value={statusFilter}
        onChange={onStatusFilterChange}
        ariaLabel="Filter candidate submissions by status"
        title="Filter candidate submissions by status"
      >
        <option value="">All</option>
        {CLIENT_SUBMISSION_STATUS_OPTIONS.map((status: VacancySubmissionStatus) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </AdminFilterSelect>

      <AdminFilterSelect
        id="vacancy-candidates-vacancy-filter"
        label="Vacancy"
        value={vacancyKeyFilter}
        onChange={onVacancyKeyFilterChange}
        ariaLabel="Filter candidate submissions by vacancy"
        title="Filter candidate submissions by vacancy"
      >
        <option value="">All</option>
        {vacancyOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </AdminFilterSelect>

      <AdminFilterDateInput
        id="vacancy-candidates-date-from"
        label="Date from"
        value={dateFrom}
        onChange={onDateFromChange}
        ariaLabel="Filter candidate submissions from date"
        title="Filter candidate submissions from date"
        max={dateTo || todayIso}
      />

      <AdminFilterDateInput
        id="vacancy-candidates-date-to"
        label="Date to"
        value={dateTo}
        onChange={onDateToChange}
        ariaLabel="Filter candidate submissions to date"
        title="Filter candidate submissions to date"
        min={dateFrom || undefined}
        max={todayIso}
      />

      <AdminFilterActions onApply={onApply} onClear={onClear} />
    </AdminTableFiltersPanel>
  );
}
