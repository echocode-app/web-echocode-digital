'use client';

import AdminToast from '@/components/admin/ui/AdminToast';
import ClientSubmissionsPagination from '@/components/admin/client-submissions/table/ClientSubmissionsPagination';
import EmailSubmissionsFilters from '@/components/admin/email-submissions/table/EmailSubmissionsFilters';
import EmailSubmissionsTableRows from '@/components/admin/email-submissions/table/EmailSubmissionsTableRows';
import {
  AdminDataTable,
  type AdminDataTableColumn,
} from '@/components/admin/shared/table/AdminDataTable';
import { useEmailSubmissionsTable } from '@/components/admin/email-submissions/table/useEmailSubmissionsTable';

const emailSubmissionColumns: AdminDataTableColumn[] = [
  { key: 'email', label: 'Email', widthClassName: 'w-[28%]' },
  { key: 'source', label: 'Source', widthClassName: 'w-36' },
  { key: 'date', label: 'Date', widthClassName: 'w-36' },
  { key: 'status', label: 'Status', widthClassName: 'w-28' },
  { key: 'comments', label: 'Comments', widthClassName: 'w-24' },
  { key: 'actions', label: 'Actions', widthClassName: 'w-64' },
];

export default function EmailSubmissionsTable() {
  const { tableState, actions } = useEmailSubmissionsTable();

  return (
    <section className="space-y-4">
      <AdminToast toast={tableState.toast} onClose={actions.clearToast} />

      <EmailSubmissionsFilters
        statusFilter={tableState.statusFilter}
        dateFrom={tableState.dateFrom}
        dateTo={tableState.dateTo}
        onStatusFilterChange={actions.setStatusFilter}
        onDateFromChange={actions.setDateFrom}
        onDateToChange={actions.setDateTo}
        onApply={actions.applyFilters}
        onClear={actions.clearFilters}
      />

      <AdminDataTable
        columns={emailSubmissionColumns}
        fixedLayout
        errorMessage={tableState.state === 'error' ? 'Unable to load email submissions.' : null}
        pagination={(
          <ClientSubmissionsPagination
            canGoPrev={tableState.canGoPrev}
            canGoNext={tableState.canGoNext}
            onPrev={actions.goPrev}
            onNext={actions.goNext}
          />
        )}
      >
        <EmailSubmissionsTableRows
          state={tableState.state}
          rows={tableState.rows}
          isApplyingStatus={tableState.isApplyingStatus}
          isDeletingSubmission={tableState.isDeletingSubmission}
          onMarkViewedLocally={actions.markRowViewedLocally}
          onUpdateStatus={actions.updateStatus}
          onSoftDelete={actions.softDelete}
          getAllowedStatusOptions={actions.getAllowedStatusOptions}
        />
      </AdminDataTable>
    </section>
  );
}
