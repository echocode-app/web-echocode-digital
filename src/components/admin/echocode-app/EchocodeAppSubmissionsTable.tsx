'use client';

import AdminToast from '@/components/admin/ui/AdminToast';
import EchocodeAppSubmissionsFilters from '@/components/admin/echocode-app/table/EchocodeAppSubmissionsFilters';
import EchocodeAppSubmissionsTableRows from '@/components/admin/echocode-app/table/EchocodeAppSubmissionsTableRows';
import { useEchocodeAppSubmissionsTable } from '@/components/admin/echocode-app/table/useEchocodeAppSubmissionsTable';
import {
  AdminDataTable,
  type AdminDataTableColumn,
} from '@/components/admin/shared/table/AdminDataTable';
import ClientSubmissionsPagination from '@/components/admin/client-submissions/table/ClientSubmissionsPagination';

const ECHOCODE_APP_SUBMISSION_COLUMNS: AdminDataTableColumn[] = [
  { key: 'createdAt', label: 'Date' },
  { key: 'contact', label: 'Contact' },
  { key: 'status', label: 'Status' },
  { key: 'attachment', label: 'Files' },
  { key: 'comments', label: 'Comments' },
  { key: 'actions', label: 'Actions' },
];

export default function EchocodeAppSubmissionsTable() {
  const { tableState, actions } = useEchocodeAppSubmissionsTable();

  return (
    <section className="space-y-4">
      <AdminToast toast={tableState.toast} onClose={actions.clearToast} />

      <EchocodeAppSubmissionsFilters
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
        columns={ECHOCODE_APP_SUBMISSION_COLUMNS}
        errorMessage={
          tableState.state === 'error' ? 'Unable to load echocode.app submissions.' : null
        }
        pagination={
          <ClientSubmissionsPagination
            canGoPrev={tableState.canGoPrev}
            canGoNext={tableState.canGoNext}
            onPrev={actions.goPrev}
            onNext={actions.goNext}
          />
        }
      >
        <EchocodeAppSubmissionsTableRows
          state={tableState.state}
          rows={tableState.rows}
          isApplyingStatus={tableState.isApplyingStatus}
          isDeletingSubmission={tableState.isDeletingSubmission}
          onMarkRowViewedLocally={actions.markRowViewedLocally}
          onUpdateStatus={actions.updateStatus}
          onSoftDelete={actions.softDelete}
          getAllowedStatusOptions={actions.getAllowedStatusOptions}
        />
      </AdminDataTable>
    </section>
  );
}
