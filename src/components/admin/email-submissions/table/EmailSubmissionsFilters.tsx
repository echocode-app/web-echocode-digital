import { CLIENT_SUBMISSION_STATUS_OPTIONS } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';
import {
  AdminFilterActions,
  AdminFilterDateInput,
  AdminFilterSelect,
  AdminTableFiltersPanel,
} from '@/components/admin/shared/filters/AdminTableFilters';
import type { EmailSubmissionStatus } from '@/server/forms/email-submission/emailSubmission.types';
import { getTodayIsoInAdminTimeZone } from '@/shared/time/europeKiev';

type EmailSubmissionsFiltersProps = {
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  onStatusFilterChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
};

export default function EmailSubmissionsFilters({
  statusFilter,
  dateFrom,
  dateTo,
  onStatusFilterChange,
  onDateFromChange,
  onDateToChange,
  onApply,
  onClear,
}: EmailSubmissionsFiltersProps) {
  const todayIso = getTodayIsoInAdminTimeZone();

  return (
    <AdminTableFiltersPanel columnsClassName="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <AdminFilterSelect
        id="email-submissions-status-filter"
        label="Status"
        value={statusFilter}
        onChange={onStatusFilterChange}
        ariaLabel="Filter email submissions by status"
        title="Filter email submissions by status"
      >
        <option value="">All</option>
        {CLIENT_SUBMISSION_STATUS_OPTIONS.map((status: EmailSubmissionStatus) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </AdminFilterSelect>

      <AdminFilterDateInput
        id="email-submissions-date-from"
        label="Date from"
        value={dateFrom}
        onChange={onDateFromChange}
        ariaLabel="Filter email submissions from date"
        title="Filter email submissions from date"
        max={dateTo || todayIso}
      />

      <AdminFilterDateInput
        id="email-submissions-date-to"
        label="Date to"
        value={dateTo}
        onChange={onDateToChange}
        ariaLabel="Filter email submissions to date"
        title="Filter email submissions to date"
        min={dateFrom || undefined}
        max={todayIso}
      />

      <AdminFilterActions onApply={onApply} onClear={onClear} />
    </AdminTableFiltersPanel>
  );
}
