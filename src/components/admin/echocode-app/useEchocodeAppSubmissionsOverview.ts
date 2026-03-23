'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAdminData } from '@/components/admin/api/fetchAdminData';
import { ADMIN_OVERVIEW_POLL_INTERVAL_MS } from '@/components/admin/shared/adminPolling';
import type { EchocodeAppSubmissionsOverviewDto } from '@/server/admin/echocode-app';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';

type LoadState = 'loading' | 'ready' | 'error';

const ECHOCODE_APP_SUBMISSIONS_OVERVIEW_REFRESH_EVENT = 'echocode-app-submissions:overview-refresh';
const POLL_INTERVAL_MS = ADMIN_OVERVIEW_POLL_INTERVAL_MS;
const FALLBACK_OVERVIEW: EchocodeAppSubmissionsOverviewDto = {
  totals: {
    currentMonth: 0,
    allTime: 0,
  },
  byStatus: { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS },
};

async function fetchOverview(signal: AbortSignal): Promise<EchocodeAppSubmissionsOverviewDto> {
  return fetchAdminData<EchocodeAppSubmissionsOverviewDto>({
    url: '/api/admin/echocode-app/submissions/overview',
    signal,
    requestErrorMessage: 'Failed to fetch echocode.app submissions overview',
    payloadErrorMessage: 'Invalid echocode.app submissions overview payload',
  });
}

export function useEchocodeAppSubmissionsOverview() {
  const [state, setState] = useState<LoadState>('loading');
  const [overview, setOverview] = useState<EchocodeAppSubmissionsOverviewDto | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const runFetch = useCallback((signal: AbortSignal) => {
    if (!signal.aborted) {
      setIsRefreshing(true);
    }

    fetchOverview(signal)
      .then((data) => {
        if (signal.aborted) return;

        setOverview(data);
        setState('ready');
        setLastUpdatedAt(Date.now());
      })
      .catch(() => {
        if (signal.aborted) return;

        setOverview(FALLBACK_OVERVIEW);
        setState('ready');
      })
      .finally(() => {
        if (!signal.aborted) {
          setIsRefreshing(false);
        }
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      runFetch(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [refreshTick, runFetch]);

  useEffect(() => {
    const onRefresh = () => setRefreshTick((prev) => prev + 1);

    const intervalId = window.setInterval(() => {
      setRefreshTick((prev) => prev + 1);
    }, POLL_INTERVAL_MS);

    window.addEventListener(ECHOCODE_APP_SUBMISSIONS_OVERVIEW_REFRESH_EVENT, onRefresh);

    return () => {
      window.removeEventListener(ECHOCODE_APP_SUBMISSIONS_OVERVIEW_REFRESH_EVENT, onRefresh);
      window.clearInterval(intervalId);
    };
  }, []);

  return { state, overview, isRefreshing, lastUpdatedAt };
}

export function notifyEchocodeAppSubmissionsOverviewRefresh() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ECHOCODE_APP_SUBMISSIONS_OVERVIEW_REFRESH_EVENT));
}
