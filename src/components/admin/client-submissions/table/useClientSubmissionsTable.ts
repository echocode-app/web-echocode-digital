'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import type { AdminToastState, AdminToastTone } from '@/components/admin/ui/AdminToast';
import { notifyClientSubmissionsOverviewRefresh } from '@/components/admin/client-submissions/useClientSubmissionsOverview';
import {
  fetchClientSubmissionsList,
  softDeleteClientSubmission,
  updateClientSubmissionStatus,
} from '@/components/admin/client-submissions/shared/clientSubmissions.api';
import {
  getAllowedStatusOptions,
} from '@/components/admin/client-submissions/shared/clientSubmissions.constants';
import { sortRowsByStatusAndDate } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';
import type {
  ClientSubmissionListItemDto,
  LoadState,
} from '@/components/admin/client-submissions/shared/clientSubmissions.types';

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
  const [state, setState] = useState<LoadState>('loading');
  const [rows, setRows] = useState<ClientSubmissionListItemDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [isApplyingStatus, setIsApplyingStatus] = useState<string | null>(null);
  const [isDeletingSubmission, setIsDeletingSubmission] = useState<string | null>(null);
  const [toast, setToast] = useState<AdminToastState>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const activeCursor = cursorStack[cursorStack.length - 1] ?? null;
  const canGoPrev = cursorStack.length > 1;
  const canGoNext = Boolean(nextCursor);

  const showToast = useCallback((tone: AdminToastTone, message: string) => {
    setToast({ id: Date.now(), tone, message });
  }, []);

  const query = useMemo(() => {
    const search = new URLSearchParams();
    search.set('limit', '20');
    if (activeCursor) search.set('cursor', activeCursor);
    if (statusFilter) search.set('status', statusFilter);
    if (dateFrom) search.set('dateFrom', dateFrom);
    if (dateTo) search.set('dateTo', dateTo);
    return search.toString();
  }, [activeCursor, dateFrom, dateTo, statusFilter]);

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');

    fetchClientSubmissionsList(query, controller.signal)
      .then((payload) => {
        setRows(sortRowsByStatusAndDate(payload.items));
        setNextCursor(payload.page.nextCursor);
        setState('ready');
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setRows([]);
          setNextCursor(null);
          setState('error');
          const message = error instanceof Error ? error.message : 'Failed to load client submissions.';
          showToast('error', message);
        }
      });

    return () => controller.abort();
  }, [query, refreshTick, showToast]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRefreshTick((prev) => prev + 1);
    }, 30000);

    const onFocus = () => setRefreshTick((prev) => prev + 1);
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const applyFilters = useCallback(() => {
    if (dateFrom && dateTo && dateTo < dateFrom) {
      showToast('error', 'Date range is invalid. "Date to" cannot be earlier than "Date from".');
      return;
    }

    setCursorStack([null]);
    showToast('info', 'Filters applied.');
  }, [dateFrom, dateTo, showToast]);

  const onDateFromChange = useCallback((value: string) => {
    const next = value > todayIso ? todayIso : value;

    setDateFrom(next);
    setDateTo((prev) => {
      if (!prev) return prev;
      if (prev > todayIso) return todayIso;
      if (next && prev < next) return next;
      return prev;
    });
  }, [todayIso]);

  const onDateToChange = useCallback((value: string) => {
    const normalized = value > todayIso ? todayIso : value;
    const next = dateFrom && normalized < dateFrom ? dateFrom : normalized;
    setDateTo(next);
  }, [dateFrom, todayIso]);

  const goNext = useCallback(() => {
    if (!nextCursor) return;
    setCursorStack((prev) => [...prev, nextCursor]);
  }, [nextCursor]);

  const goPrev = useCallback(() => {
    if (cursorStack.length <= 1) return;
    setCursorStack((prev) => prev.slice(0, -1));
  }, [cursorStack.length]);

  const markRowViewedLocally = useCallback((submissionId: string) => {
    setRows((prev) => sortRowsByStatusAndDate(prev.map((row) => (
      row.id === submissionId && row.status === 'new'
        ? { ...row, status: 'viewed' }
        : row
    ))));
  }, []);

  const updateStatus = useCallback(async (submissionId: string, nextStatus: ClientSubmissionStatus) => {
    setIsApplyingStatus(submissionId);

    try {
      await updateClientSubmissionStatus({ submissionId, status: nextStatus });
      setRows((prev) => {
        const updated = prev.map((row) => (row.id === submissionId ? { ...row, status: nextStatus } : row));
        const filtered = statusFilter
          ? updated.filter((row) => row.status === statusFilter)
          : updated;

        return sortRowsByStatusAndDate(filtered);
      });

      // Sync pagination window after mutations so filtered lists stay accurate.
      setRefreshTick((prev) => prev + 1);
      notifyClientSubmissionsOverviewRefresh();
      showToast('success', `Status updated to "${nextStatus}".`);
    } catch (error) {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Unable to update status. Check connection and retry.',
      );
    } finally {
      setIsApplyingStatus(null);
    }
  }, [showToast, statusFilter]);

  const softDelete = useCallback(async (submissionId: string) => {
    const isConfirmed = window.confirm(
      'Remove this submission from the list? This is a soft delete and can still be found in the database.',
    );
    if (!isConfirmed) return;

    setIsDeletingSubmission(submissionId);

    try {
      await softDeleteClientSubmission({ submissionId });
      setRows((prev) => prev.filter((row) => row.id !== submissionId));
      setRefreshTick((prev) => prev + 1);
      notifyClientSubmissionsOverviewRefresh();
      showToast('success', 'Submission removed from active list.');
    } catch (error) {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Unable to remove submission. Check connection and retry.',
      );
    } finally {
      setIsDeletingSubmission(null);
    }
  }, [showToast]);

  return {
    tableState: {
      state,
      rows,
      nextCursor,
      canGoPrev,
      canGoNext,
      statusFilter,
      dateFrom,
      dateTo,
      isApplyingStatus,
      isDeletingSubmission,
      toast,
    },
    actions: {
      setStatusFilter,
      setDateFrom: onDateFromChange,
      setDateTo: onDateToChange,
      applyFilters,
      goNext,
      goPrev,
      clearToast: () => setToast(null),
      markRowViewedLocally,
      updateStatus,
      softDelete,
      getAllowedStatusOptions,
    },
  };
}
