'use client';

import { useCallback } from 'react';
import type { SubmissionListStatus } from '@/server/submissions/submissions.types';
import {
  fetchEchocodeAppSubmissionsList,
  softDeleteEchocodeAppSubmission,
  updateEchocodeAppSubmissionStatus,
} from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.api';
import { notifyEchocodeAppSubmissionsOverviewRefresh } from '@/components/admin/echocode-app/useEchocodeAppSubmissionsOverview';
import { getAllowedStatusOptions } from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.constants';
import { sortRowsByStatusAndDate } from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.formatters';
import type {
  EchocodeAppSubmissionListItemDto,
  LoadState,
} from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.types';
import {
  useModerationTableCore,
  type ModerationTableQueryInput,
} from '@/components/admin/shared/moderation-table/useModerationTableCore';
import type { AdminToastState } from '@/components/admin/ui/AdminToast';

export type EchocodeAppSubmissionsTableState = {
  state: LoadState;
  rows: EchocodeAppSubmissionListItemDto[];
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

export type EchocodeAppSubmissionsTableActions = {
  setStatusFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  goNext: () => void;
  goPrev: () => void;
  clearToast: () => void;
  markRowViewedLocally: (submissionId: string) => void;
  updateStatus: (submissionId: string, nextStatus: SubmissionListStatus) => Promise<void>;
  softDelete: (submissionId: string) => Promise<void>;
  getAllowedStatusOptions: (currentStatus: SubmissionListStatus) => SubmissionListStatus[];
};

export function useEchocodeAppSubmissionsTable(): {
  tableState: EchocodeAppSubmissionsTableState;
  actions: EchocodeAppSubmissionsTableActions;
} {
  const buildQuery = useCallback(
    ({ activeCursor, statusFilter, dateFrom, dateTo }: ModerationTableQueryInput) => {
      const search = new URLSearchParams();
      search.set('limit', '20');
      if (activeCursor) search.set('cursor', activeCursor);
      if (statusFilter) search.set('status', statusFilter);
      if (dateFrom) search.set('dateFrom', dateFrom);
      if (dateTo) search.set('dateTo', dateTo);
      return search.toString();
    },
    [],
  );

  const core = useModerationTableCore<EchocodeAppSubmissionListItemDto, SubmissionListStatus>({
    buildQuery,
    fetchList: fetchEchocodeAppSubmissionsList,
    sortRows: sortRowsByStatusAndDate,
    updateStatusRequest: updateEchocodeAppSubmissionStatus,
    softDeleteRequest: softDeleteEchocodeAppSubmission,
    filterVisibleRows: (rows, filters) =>
      rows.filter((row) => !filters.statusFilter || row.status === filters.statusFilter),
    loadErrorMessage: 'Failed to load echocode.app submissions.',
    deleteConfirmMessage:
      'Remove this submission from the list? This is a soft delete and can still be found in the database.',
    deleteSuccessMessage: 'Submission removed from active list.',
    deleteErrorMessage: 'Unable to remove submission. Check connection and retry.',
    updateErrorMessage: 'Unable to update status. Check connection and retry.',
    getUpdateSuccessMessage: (status) => `Status updated to "${status}".`,
    onOverviewRefresh: notifyEchocodeAppSubmissionsOverviewRefresh,
    getOpenStateStatus: (currentStatus) => (currentStatus === 'new' ? 'viewed' : null),
  });

  return {
    tableState: core.tableState,
    actions: {
      ...core.actions,
      markRowViewedLocally: core.actions.markRowViewedLocally,
      getAllowedStatusOptions,
    },
  };
}
