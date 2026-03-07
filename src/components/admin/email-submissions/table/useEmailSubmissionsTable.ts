'use client';

import { useCallback } from 'react';
import type { EmailSubmissionStatus } from '@/server/forms/email-submission/emailSubmission.types';
import { notifyEmailSubmissionsOverviewRefresh } from '@/components/admin/email-submissions/useEmailSubmissionsOverview';
import {
  fetchEmailSubmissionsList,
  softDeleteEmailSubmission,
  updateEmailSubmissionStatus,
} from '@/components/admin/email-submissions/shared/emailSubmissions.api';
import { getAllowedStatusOptions } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';
import { sortRowsByStatusAndDate } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';
import type {
  EmailSubmissionListItemDto,
  LoadState,
} from '@/components/admin/email-submissions/shared/emailSubmissions.types';
import {
  useModerationTableCore,
  type ModerationTableQueryInput,
} from '@/components/admin/shared/moderation-table/useModerationTableCore';
import type { AdminToastState } from '@/components/admin/ui/AdminToast';

export type EmailSubmissionsTableState = {
  state: LoadState;
  rows: EmailSubmissionListItemDto[];
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

export type EmailSubmissionsTableActions = {
  setStatusFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  goNext: () => void;
  goPrev: () => void;
  clearToast: () => void;
  markRowViewedLocally: (submissionId: string) => void;
  updateStatus: (submissionId: string, nextStatus: EmailSubmissionStatus) => Promise<void>;
  softDelete: (submissionId: string) => Promise<void>;
  getAllowedStatusOptions: (currentStatus: EmailSubmissionStatus) => EmailSubmissionStatus[];
};

export function useEmailSubmissionsTable(): {
  tableState: EmailSubmissionsTableState;
  actions: EmailSubmissionsTableActions;
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

  const core = useModerationTableCore<EmailSubmissionListItemDto, EmailSubmissionStatus>({
    buildQuery,
    fetchList: fetchEmailSubmissionsList,
    sortRows: sortRowsByStatusAndDate,
    updateStatusRequest: updateEmailSubmissionStatus,
    softDeleteRequest: softDeleteEmailSubmission,
    filterVisibleRows: (rows, filters) =>
      rows.filter((row) => !filters.statusFilter || row.status === filters.statusFilter),
    loadErrorMessage: 'Failed to load email submissions.',
    deleteConfirmMessage:
      'Remove this email submission from the list? This is a soft delete and can still be found in the database.',
    deleteSuccessMessage: 'Submission removed from active list.',
    deleteErrorMessage: 'Unable to remove submission. Check connection and retry.',
    updateErrorMessage: 'Unable to update status. Check connection and retry.',
    getUpdateSuccessMessage: (status) => `Status updated to "${status}".`,
    onOverviewRefresh: notifyEmailSubmissionsOverviewRefresh,
  });

  return {
    tableState: core.tableState,
    actions: {
      ...core.actions,
      getAllowedStatusOptions,
    },
  };
}
