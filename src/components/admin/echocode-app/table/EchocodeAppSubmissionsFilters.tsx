import { ECHOCODE_APP_SUBMISSION_STATUS_OPTIONS } from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.constants';
import {
  AdminFilterActions,
  AdminFilterDateInput,
  AdminFilterSelect,
  AdminTableFiltersPanel,
} from '@/components/admin/shared/filters/AdminTableFilters';
import { getTodayIsoInAdminTimeZone } from '@/shared/time/europeKiev';

type EchocodeAppSubmissionsFiltersProps = {
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  onStatusFilterChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
};

export default function EchocodeAppSubmissionsFilters({
  statusFilter,
  dateFrom,
  dateTo,
  onStatusFilterChange,
  onDateFromChange,
  onDateToChange,
  onApply,
  onClear,
}: EchocodeAppSubmissionsFiltersProps) {
  const todayIso = getTodayIsoInAdminTimeZone();

  return (
    <AdminTableFiltersPanel columnsClassName="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <AdminFilterSelect
        id="echocode-app-submissions-status-filter"
        label="Status"
        value={statusFilter}
        onChange={onStatusFilterChange}
        ariaLabel="Filter echocode.app submissions by status"
        title="Filter echocode.app submissions by status"
      >
        <option value="">All</option>
        {ECHOCODE_APP_SUBMISSION_STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </AdminFilterSelect>

      <AdminFilterDateInput
        id="echocode-app-submissions-date-from"
        label="Date from"
        value={dateFrom}
        onChange={onDateFromChange}
        ariaLabel="Filter echocode.app submissions from date"
        title="Filter echocode.app submissions from date"
        max={dateTo || todayIso}
      />

      <AdminFilterDateInput
        id="echocode-app-submissions-date-to"
        label="Date to"
        value={dateTo}
        onChange={onDateToChange}
        ariaLabel="Filter echocode.app submissions to date"
        title="Filter echocode.app submissions to date"
        min={dateFrom || undefined}
        max={todayIso}
      />

      <AdminFilterActions onApply={onApply} onClear={onClear} />
    </AdminTableFiltersPanel>
  );
}
