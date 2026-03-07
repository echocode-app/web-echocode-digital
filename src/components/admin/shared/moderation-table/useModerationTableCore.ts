'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AdminToastState, AdminToastTone } from '@/components/admin/ui/AdminToast';
import { getTodayIsoInAdminTimeZone } from '@/shared/time/europeKiev';

export type ModerationLoadState = 'loading' | 'ready' | 'error';

type ModerationListPayload<TRow> = {
  items: TRow[];
  page: {
    nextCursor: string | null;
  };
};

type ModerationRowLike<TStatus extends string> = {
  id: string;
  status: TStatus;
};

export type ModerationTableQueryInput = {
  activeCursor: string | null;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
};

type ModerationTableCoreOptions<TRow extends ModerationRowLike<TStatus>, TStatus extends string> = {
  buildQuery: (input: ModerationTableQueryInput) => string;
  fetchList: (query: string, signal: AbortSignal) => Promise<ModerationListPayload<TRow>>;
  sortRows: (rows: TRow[]) => TRow[];
  updateStatusRequest: (input: { submissionId: string; status: TStatus }) => Promise<void>;
  softDeleteRequest: (input: { submissionId: string }) => Promise<void>;
  filterVisibleRows: (
    rows: TRow[],
    filters: { statusFilter: string; dateFrom: string; dateTo: string },
  ) => TRow[];
  loadErrorMessage: string;
  deleteConfirmMessage: string;
  deleteSuccessMessage: string;
  deleteErrorMessage: string;
  updateErrorMessage: string;
  getUpdateSuccessMessage: (status: TStatus) => string;
  onOverviewRefresh: () => void;
};

type ModerationTableCoreState<TRow> = {
  state: ModerationLoadState;
  rows: TRow[];
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

type ModerationTableCoreActions<TStatus extends string> = {
  setStatusFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  goNext: () => void;
  goPrev: () => void;
  clearToast: () => void;
  markRowViewedLocally: (submissionId: string) => void;
  updateStatus: (submissionId: string, nextStatus: TStatus) => Promise<void>;
  softDelete: (submissionId: string) => Promise<void>;
};

export function useModerationTableCore<
  TRow extends ModerationRowLike<TStatus>,
  TStatus extends string,
>(
  options: ModerationTableCoreOptions<TRow, TStatus>,
): {
  tableState: ModerationTableCoreState<TRow>;
  actions: ModerationTableCoreActions<TStatus>;
  refresh: () => void;
} {
  // This hook owns the repeated moderation-table mechanics so each queue hook can stay domain-focused.
  const {
    buildQuery,
    fetchList,
    sortRows,
    updateStatusRequest,
    softDeleteRequest,
    filterVisibleRows,
    loadErrorMessage,
    deleteConfirmMessage,
    deleteSuccessMessage,
    deleteErrorMessage,
    updateErrorMessage,
    getUpdateSuccessMessage,
    onOverviewRefresh,
  } = options;

  const [state, setState] = useState<ModerationLoadState>('loading');
  const [rows, setRows] = useState<TRow[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [isApplyingStatus, setIsApplyingStatus] = useState<string | null>(null);
  const [isDeletingSubmission, setIsDeletingSubmission] = useState<string | null>(null);
  const [toast, setToast] = useState<AdminToastState>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const todayIso = useMemo(() => getTodayIsoInAdminTimeZone(), []);
  const activeCursor = cursorStack[cursorStack.length - 1] ?? null;
  const canGoPrev = cursorStack.length > 1;
  const canGoNext = Boolean(nextCursor);

  const showToast = useCallback((tone: AdminToastTone, message: string) => {
    setToast({ id: Date.now(), tone, message });
  }, []);

  const query = useMemo(
    () =>
      buildQuery({
        activeCursor,
        statusFilter,
        dateFrom,
        dateTo,
      }),
    [activeCursor, buildQuery, dateFrom, dateTo, statusFilter],
  );

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');

    fetchList(query, controller.signal)
      .then((payload) => {
        setRows(sortRows(payload.items));
        setNextCursor(payload.page.nextCursor);
        setState('ready');
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setRows([]);
          setNextCursor(null);
          setState('error');
          const message = error instanceof Error ? error.message : loadErrorMessage;
          showToast('error', message);
        }
      });

    return () => controller.abort();
  }, [fetchList, loadErrorMessage, query, refreshTick, showToast, sortRows]);

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

  const clearFilters = useCallback(() => {
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setCursorStack([null]);
    showToast('info', 'Filters cleared.');
  }, [showToast]);

  const onDateFromChange = useCallback(
    (value: string) => {
      const next = value > todayIso ? todayIso : value;

      setDateFrom(next);
      setDateTo((prev) => {
        if (!prev) return prev;
        if (prev > todayIso) return todayIso;
        if (next && prev < next) return next;
        return prev;
      });
    },
    [todayIso],
  );

  const onDateToChange = useCallback(
    (value: string) => {
      const normalized = value > todayIso ? todayIso : value;
      const next = dateFrom && normalized < dateFrom ? dateFrom : normalized;
      setDateTo(next);
    },
    [dateFrom, todayIso],
  );

  const goNext = useCallback(() => {
    if (!nextCursor) return;
    setCursorStack((prev) => [...prev, nextCursor]);
  }, [nextCursor]);

  const goPrev = useCallback(() => {
    if (cursorStack.length <= 1) return;
    setCursorStack((prev) => prev.slice(0, -1));
  }, [cursorStack.length]);

  const markRowViewedLocally = useCallback(
    (submissionId: string) => {
      setRows((prev) =>
        sortRows(
          prev.map((row) =>
            row.id === submissionId && row.status === 'new'
              ? { ...row, status: 'viewed' as TStatus }
              : row,
          ),
        ),
      );
    },
    [sortRows],
  );

  const updateStatus = useCallback(
    async (submissionId: string, nextStatus: TStatus) => {
      setIsApplyingStatus(submissionId);

      try {
        await updateStatusRequest({ submissionId, status: nextStatus });
        setRows((prev) => {
          const updated = prev.map((row) =>
            row.id === submissionId ? { ...row, status: nextStatus } : row,
          );

          return sortRows(filterVisibleRows(updated, { statusFilter, dateFrom, dateTo }));
        });

        setRefreshTick((prev) => prev + 1);
        onOverviewRefresh();
        showToast('success', getUpdateSuccessMessage(nextStatus));
      } catch (error) {
        showToast('error', error instanceof Error ? error.message : updateErrorMessage);
      } finally {
        setIsApplyingStatus(null);
      }
    },
    [
      dateFrom,
      dateTo,
      filterVisibleRows,
      getUpdateSuccessMessage,
      onOverviewRefresh,
      showToast,
      sortRows,
      statusFilter,
      updateErrorMessage,
      updateStatusRequest,
    ],
  );

  const softDelete = useCallback(
    async (submissionId: string) => {
      const isConfirmed = window.confirm(deleteConfirmMessage);
      if (!isConfirmed) return;

      setIsDeletingSubmission(submissionId);

      try {
        await softDeleteRequest({ submissionId });
        setRows((prev) => prev.filter((row) => row.id !== submissionId));
        setRefreshTick((prev) => prev + 1);
        onOverviewRefresh();
        showToast('success', deleteSuccessMessage);
      } catch (error) {
        showToast('error', error instanceof Error ? error.message : deleteErrorMessage);
      } finally {
        setIsDeletingSubmission(null);
      }
    },
    [
      deleteConfirmMessage,
      deleteErrorMessage,
      deleteSuccessMessage,
      onOverviewRefresh,
      showToast,
      softDeleteRequest,
    ],
  );

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
      clearFilters,
      goNext,
      goPrev,
      clearToast: () => setToast(null),
      markRowViewedLocally,
      updateStatus,
      softDelete,
    },
    refresh: () => setRefreshTick((prev) => prev + 1),
  };
}
