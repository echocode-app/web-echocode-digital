'use client';

import AdminToast from '@/components/admin/ui/AdminToast';
import ClientSubmissionsPagination from '@/components/admin/client-submissions/table/ClientSubmissionsPagination';
import {
  AdminDataTable,
  type AdminDataTableColumn,
} from '@/components/admin/shared/table/AdminDataTable';
import VacancyCandidatesFilters from '@/components/admin/vacancy-candidates/table/VacancyCandidatesFilters';
import VacancyCandidatesTableRows from '@/components/admin/vacancy-candidates/table/VacancyCandidatesTableRows';
import { useVacancyCandidatesTable } from '@/components/admin/vacancy-candidates/table/useVacancyCandidatesTable';

const vacancyCandidateColumns: AdminDataTableColumn[] = [
  { key: 'vacancy', label: 'Vacancy' },
  { key: 'profile', label: 'Profile' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'cv', label: 'CV' },
  { key: 'comments', label: 'Comments' },
  { key: 'actions', label: 'Actions' },
];

export default function VacancyCandidatesTable() {
  const { tableState, actions } = useVacancyCandidatesTable();

  return (
    <section className="space-y-4">
      <AdminToast toast={tableState.toast} onClose={actions.clearToast} />

      <VacancyCandidatesFilters
        statusFilter={tableState.statusFilter}
        vacancyKeyFilter={tableState.vacancyKeyFilter}
        vacancyOptions={tableState.vacancyOptions}
        dateFrom={tableState.dateFrom}
        dateTo={tableState.dateTo}
        onStatusFilterChange={actions.setStatusFilter}
        onVacancyKeyFilterChange={actions.setVacancyKeyFilter}
        onDateFromChange={actions.setDateFrom}
        onDateToChange={actions.setDateTo}
        onApply={actions.applyFilters}
        onClear={actions.clearFilters}
      />

      <AdminDataTable
        columns={vacancyCandidateColumns}
        errorMessage={tableState.state === 'error' ? 'Unable to load candidate submissions.' : null}
        pagination={(
          <ClientSubmissionsPagination
            canGoPrev={tableState.canGoPrev}
            canGoNext={tableState.canGoNext}
            onPrev={actions.goPrev}
            onNext={actions.goNext}
          />
        )}
      >
        <VacancyCandidatesTableRows
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
