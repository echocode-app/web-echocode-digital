'use client';

import AdminToast from '@/components/admin/ui/AdminToast';
import ClientSubmissionsFilters from '@/components/admin/client-submissions/table/ClientSubmissionsFilters';
import ClientSubmissionsPagination from '@/components/admin/client-submissions/table/ClientSubmissionsPagination';
import ClientSubmissionsTableRows from '@/components/admin/client-submissions/table/ClientSubmissionsTableRows';
import {
  AdminDataTable,
  type AdminDataTableColumn,
} from '@/components/admin/shared/table/AdminDataTable';
import { useClientSubmissionsTable } from '@/components/admin/client-submissions/table/useClientSubmissionsTable';

const clientSubmissionColumns: AdminDataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'files', label: 'Files' },
  { key: 'comments', label: 'Comments' },
  { key: 'actions', label: 'Actions' },
];

export default function ClientSubmissionsTable() {
  const { tableState, actions } = useClientSubmissionsTable();

  return (
    <section className="space-y-4">
      <AdminToast toast={tableState.toast} onClose={actions.clearToast} />

      <ClientSubmissionsFilters
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
        columns={clientSubmissionColumns}
        errorMessage={tableState.state === 'error' ? 'Unable to load client submissions.' : null}
        pagination={(
          <ClientSubmissionsPagination
            canGoPrev={tableState.canGoPrev}
            canGoNext={tableState.canGoNext}
            onPrev={actions.goPrev}
            onNext={actions.goNext}
          />
        )}
      >
        <ClientSubmissionsTableRows
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
