import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import { CLIENT_SUBMISSION_STATUS_OPTIONS } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';
import {
  AdminFilterActions,
  AdminFilterDateInput,
  AdminFilterSelect,
  AdminTableFiltersPanel,
} from '@/components/admin/shared/filters/AdminTableFilters';
import { getTodayIsoInAdminTimeZone } from '@/shared/time/europeKiev';

type ClientSubmissionsFiltersProps = {
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  onStatusFilterChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
};

export default function ClientSubmissionsFilters({
  statusFilter,
  dateFrom,
  dateTo,
  onStatusFilterChange,
  onDateFromChange,
  onDateToChange,
  onApply,
  onClear,
}: ClientSubmissionsFiltersProps) {
  const todayIso = getTodayIsoInAdminTimeZone();

  return (
    <AdminTableFiltersPanel columnsClassName="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <AdminFilterSelect
        id="client-submissions-status-filter"
        label="Status"
        value={statusFilter}
        onChange={onStatusFilterChange}
        ariaLabel="Filter submissions by status"
        title="Filter submissions by status"
      >
        <option value="">All</option>
        {CLIENT_SUBMISSION_STATUS_OPTIONS.map((status: ClientSubmissionStatus) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </AdminFilterSelect>

      <AdminFilterDateInput
        id="client-submissions-date-from"
        label="Date from"
        value={dateFrom}
        onChange={onDateFromChange}
        ariaLabel="Filter submissions from date"
        title="Filter submissions from date"
        max={dateTo || todayIso}
      />

      <AdminFilterDateInput
        id="client-submissions-date-to"
        label="Date to"
        value={dateTo}
        onChange={onDateToChange}
        ariaLabel="Filter submissions to date"
        title="Filter submissions to date"
        min={dateFrom || undefined}
        max={todayIso}
      />

      <AdminFilterActions onApply={onApply} onClear={onClear} />
    </AdminTableFiltersPanel>
  );
}
