'use client';

import AdminToast from '@/components/admin/ui/AdminToast';
import ClientSubmissionsFilters from '@/components/admin/client-submissions/table/ClientSubmissionsFilters';
import ClientSubmissionsTableRows from '@/components/admin/client-submissions/table/ClientSubmissionsTableRows';
import ClientSubmissionsPagination from '@/components/admin/client-submissions/table/ClientSubmissionsPagination';
import { useClientSubmissionsTable } from '@/components/admin/client-submissions/table/useClientSubmissionsTable';

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
      />

      <article className="overflow-x-auto rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left font-main text-main-xs uppercase tracking-[0.12em] text-gray60">
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Files</th>
              <th className="px-2 py-1">Comments</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>

        {tableState.state === 'error' ? (
          <p className="mt-3 font-main text-main-sm text-[#ff6d7a]">Unable to load client submissions.</p>
        ) : null}

        <ClientSubmissionsPagination
          canGoPrev={tableState.canGoPrev}
          canGoNext={tableState.canGoNext}
          onPrev={actions.goPrev}
          onNext={actions.goNext}
        />
      </article>
    </section>
  );
}
