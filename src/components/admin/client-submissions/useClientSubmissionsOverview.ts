'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ClientSubmissionsOverviewDto } from '@/server/forms/client-project/clientProject.types';
import { getFirebaseClientAuth } from '@/lib/firebase/client';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';

type LoadState = 'loading' | 'ready' | 'error';
const CLIENT_SUBMISSIONS_OVERVIEW_REFRESH_EVENT = 'client-submissions:overview-refresh';
const POLL_INTERVAL_MS = 15000;
const FALLBACK_OVERVIEW: ClientSubmissionsOverviewDto = {
  totals: {
    currentMonth: 0,
    allTime: 0,
  },
  byStatus: { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS },
  statusesByMonth: [],
};

async function getTokenOrThrow(): Promise<string> {
  const auth = getFirebaseClientAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user.getIdToken(true);
}

export function useClientSubmissionsOverview() {
  const [state, setState] = useState<LoadState>('loading');
  const [overview, setOverview] = useState<ClientSubmissionsOverviewDto | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const fetchOverview = useCallback((signal: AbortSignal) => {
    getTokenOrThrow()
      .then(async (token) => {
        if (!signal.aborted) {
          setIsRefreshing(true);
        }

        const response = await fetch('/api/admin/submissions/clients/overview', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
          signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load client submissions overview');
        }

        const payload = (await response.json()) as {
          success: boolean;
          data?: ClientSubmissionsOverviewDto;
        };

        if (!payload.success || !payload.data) {
          throw new Error('Invalid client submissions overview payload');
        }

        setOverview(payload.data);
        setState('ready');
        setLastUpdatedAt(Date.now());
      })
      .catch(() => {
        if (!signal.aborted) {
          setOverview(FALLBACK_OVERVIEW);
          setState('ready');
        }
      })
      .finally(() => {
        if (!signal.aborted) {
          setIsRefreshing(false);
        }
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchOverview(controller.signal);

    return () => controller.abort();
  }, [fetchOverview, refreshTick]);

  useEffect(() => {
    const onRefresh = () => setRefreshTick((prev) => prev + 1);
    const onFocus = () => setRefreshTick((prev) => prev + 1);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        setRefreshTick((prev) => prev + 1);
      }
    };

    const intervalId = window.setInterval(() => {
      setRefreshTick((prev) => prev + 1);
    }, POLL_INTERVAL_MS);

    window.addEventListener(CLIENT_SUBMISSIONS_OVERVIEW_REFRESH_EVENT, onRefresh);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener(CLIENT_SUBMISSIONS_OVERVIEW_REFRESH_EVENT, onRefresh);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(intervalId);
    };
  }, []);

  return { state, overview, isRefreshing, lastUpdatedAt };
}

export function notifyClientSubmissionsOverviewRefresh() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CLIENT_SUBMISSIONS_OVERVIEW_REFRESH_EVENT));
}
