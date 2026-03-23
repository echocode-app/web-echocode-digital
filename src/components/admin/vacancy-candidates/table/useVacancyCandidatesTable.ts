'use client';

import { useCallback, useMemo, useState } from 'react';
import type { VacancySubmissionStatus } from '@/server/forms/vacancy-submission/vacancySubmission.types';
import type { AdminToastState } from '@/components/admin/ui/AdminToast';
import {
  notifyVacancyCandidatesOverviewRefresh,
  useVacancyCandidatesOverview,
} from '@/components/admin/vacancy-candidates/useVacancyCandidatesOverview';
import {
  fetchVacancyCandidatesList,
  softDeleteVacancyCandidate,
  updateVacancyCandidateStatus,
} from '@/components/admin/vacancy-candidates/shared/vacancyCandidates.api';
import { getAllowedStatusOptions } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';
import { sortRowsByStatusAndDate } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';
import type {
  LoadState,
  VacancyCandidateListItemDto,
} from '@/components/admin/vacancy-candidates/shared/vacancyCandidates.types';
import {
  useModerationTableCore,
  type ModerationTableQueryInput,
} from '@/components/admin/shared/moderation-table/useModerationTableCore';

export type VacancyCandidatesTableState = {
  state: LoadState;
  rows: VacancyCandidateListItemDto[];
  nextCursor: string | null;
  canGoPrev: boolean;
  canGoNext: boolean;
  statusFilter: string;
  vacancyKeyFilter: string;
  dateFrom: string;
  dateTo: string;
  vacancyOptions: { value: string; label: string }[];
  isApplyingStatus: string | null;
  isDeletingSubmission: string | null;
  toast: AdminToastState;
};

export type VacancyCandidatesTableActions = {
  setStatusFilter: (value: string) => void;
  setVacancyKeyFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  goNext: () => void;
  goPrev: () => void;
  clearToast: () => void;
  markRowViewedLocally: (submissionId: string) => void;
  updateStatus: (submissionId: string, nextStatus: VacancySubmissionStatus) => Promise<void>;
  softDelete: (submissionId: string) => Promise<void>;
  getAllowedStatusOptions: (currentStatus: VacancySubmissionStatus) => VacancySubmissionStatus[];
};

export function useVacancyCandidatesTable(): {
  tableState: VacancyCandidatesTableState;
  actions: VacancyCandidatesTableActions;
} {
  const [vacancyKeyFilter, setVacancyKeyFilter] = useState<string>('');
  const { overview } = useVacancyCandidatesOverview();

  const vacancyOptions = useMemo(
    () =>
      overview?.byVacancy.map((group) => ({
        value: group.vacancyKey,
        label: group.vacancy.vacancyTitle || group.vacancyKey,
      })) ?? [],
    [overview],
  );

  const buildQuery = useCallback(
    ({ activeCursor, statusFilter, dateFrom, dateTo }: ModerationTableQueryInput) => {
      const search = new URLSearchParams();
      search.set('limit', '20');
      if (activeCursor) search.set('cursor', activeCursor);
      if (statusFilter) search.set('status', statusFilter);
      if (vacancyKeyFilter) search.set('vacancyKey', vacancyKeyFilter);
      if (dateFrom) search.set('dateFrom', dateFrom);
      if (dateTo) search.set('dateTo', dateTo);
      return search.toString();
    },
    [vacancyKeyFilter],
  );

  const core = useModerationTableCore<VacancyCandidateListItemDto, VacancySubmissionStatus>({
    buildQuery,
    fetchList: fetchVacancyCandidatesList,
    sortRows: sortRowsByStatusAndDate,
    updateStatusRequest: updateVacancyCandidateStatus,
    softDeleteRequest: softDeleteVacancyCandidate,
    filterVisibleRows: (rows, filters) =>
      rows.filter((row) => {
        if (filters.statusFilter && row.status !== filters.statusFilter) return false;
        if (vacancyKeyFilter && row.vacancyKey !== vacancyKeyFilter) return false;
        return true;
      }),
    loadErrorMessage: 'Failed to load candidate submissions.',
    deleteConfirmMessage:
      'Remove this candidate submission from the list? This is a soft delete and can still be found in the database.',
    deleteSuccessMessage: 'Submission removed from active list.',
    deleteErrorMessage: 'Unable to remove submission. Check connection and retry.',
    updateErrorMessage: 'Unable to update status. Check connection and retry.',
    getUpdateSuccessMessage: (status) => `Status updated to "${status}".`,
    onOverviewRefresh: notifyVacancyCandidatesOverviewRefresh,
  });

  const clearFilters = useCallback(() => {
    setVacancyKeyFilter('');
    core.actions.clearFilters();
  }, [core.actions]);

  return {
    tableState: {
      ...core.tableState,
      vacancyKeyFilter,
      vacancyOptions,
    },
    actions: {
      ...core.actions,
      clearFilters,
      setVacancyKeyFilter,
      getAllowedStatusOptions,
    },
  };
}
