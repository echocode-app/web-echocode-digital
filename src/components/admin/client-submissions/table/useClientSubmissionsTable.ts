'use client';

import { useCallback } from 'react';
import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import { notifyClientSubmissionsOverviewRefresh } from '@/components/admin/client-submissions/useClientSubmissionsOverview';
import {
  fetchClientSubmissionsList,
  softDeleteClientSubmission,
  updateClientSubmissionStatus,
} from '@/components/admin/client-submissions/shared/clientSubmissions.api';
import { getAllowedStatusOptions } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';
import { sortRowsByStatusAndDate } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';
import type {
  ClientSubmissionListItemDto,
  LoadState,
} from '@/components/admin/client-submissions/shared/clientSubmissions.types';
import {
  useModerationTableCore,
  type ModerationTableQueryInput,
} from '@/components/admin/shared/moderation-table/useModerationTableCore';
import type { AdminToastState } from '@/components/admin/ui/AdminToast';

export type ClientSubmissionsTableState = {
  state: LoadState;
  rows: ClientSubmissionListItemDto[];
  nextCursor: string | null;
  canGoPrev: boolean;
  canGoNext: boolean;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  isApplyingStatus: string | null;
  isDeletingSubmission: string | null;
  toast: AdminToastState;
};

export type ClientSubmissionsTableActions = {
  setStatusFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  goNext: () => void;
  goPrev: () => void;
  clearToast: () => void;
  markRowViewedLocally: (submissionId: string) => void;
  updateStatus: (submissionId: string, nextStatus: ClientSubmissionStatus) => Promise<void>;
  softDelete: (submissionId: string) => Promise<void>;
  getAllowedStatusOptions: (currentStatus: ClientSubmissionStatus) => ClientSubmissionStatus[];
};

export function useClientSubmissionsTable(): {
  tableState: ClientSubmissionsTableState;
  actions: ClientSubmissionsTableActions;
} {
  const buildQuery = useCallback(({ activeCursor, statusFilter, dateFrom, dateTo }: ModerationTableQueryInput) => {
    const search = new URLSearchParams();
    search.set('limit', '20');
    if (activeCursor) search.set('cursor', activeCursor);
    if (statusFilter) search.set('status', statusFilter);
    if (dateFrom) search.set('dateFrom', dateFrom);
    if (dateTo) search.set('dateTo', dateTo);
    return search.toString();
  }, []);

  const core = useModerationTableCore<ClientSubmissionListItemDto, ClientSubmissionStatus>({
    buildQuery,
    fetchList: fetchClientSubmissionsList,
    sortRows: sortRowsByStatusAndDate,
    updateStatusRequest: updateClientSubmissionStatus,
    softDeleteRequest: softDeleteClientSubmission,
    filterVisibleRows: (rows, filters) => rows.filter((row) => !filters.statusFilter || row.status === filters.statusFilter),
    loadErrorMessage: 'Failed to load client submissions.',
    deleteConfirmMessage: 'Remove this submission from the list? This is a soft delete and can still be found in the database.',
    deleteSuccessMessage: 'Submission removed from active list.',
    deleteErrorMessage: 'Unable to remove submission. Check connection and retry.',
    updateErrorMessage: 'Unable to update status. Check connection and retry.',
    getUpdateSuccessMessage: (status) => `Status updated to "${status}".`,
    onOverviewRefresh: notifyClientSubmissionsOverviewRefresh,
  });

  return {
    tableState: core.tableState,
    actions: {
      ...core.actions,
      getAllowedStatusOptions,
    },
  };
}
