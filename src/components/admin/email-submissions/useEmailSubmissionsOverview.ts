'use client';

import { useCallback, useEffect, useState } from 'react';
import type { EmailSubmissionsOverviewDto } from '@/server/forms/email-submission/emailSubmission.types';
import {
  getAdminIdTokenOrThrow,
  withAuthHeaders,
} from '@/components/admin/moderation/shared/adminModeration.api';
import { ADMIN_OVERVIEW_POLL_INTERVAL_MS } from '@/components/admin/shared/adminPolling';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';

type LoadState = 'loading' | 'ready' | 'error';
const EMAIL_SUBMISSIONS_OVERVIEW_REFRESH_EVENT = 'email-submissions:overview-refresh';
const POLL_INTERVAL_MS = ADMIN_OVERVIEW_POLL_INTERVAL_MS;
const FALLBACK_OVERVIEW: EmailSubmissionsOverviewDto = {
  totals: {
    currentMonth: 0,
    allTime: 0,
  },
  byStatus: { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS },
  statusesByMonth: [],
};

export function useEmailSubmissionsOverview() {
  const [state, setState] = useState<LoadState>('loading');
  const [overview, setOverview] = useState<EmailSubmissionsOverviewDto | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const fetchOverview = useCallback((signal: AbortSignal) => {
    getAdminIdTokenOrThrow()
      .then(async (token) => {
        if (!signal.aborted) {
          setIsRefreshing(true);
        }

        const response = await fetch('/api/admin/submissions/emails/overview', {
          method: 'GET',
          headers: withAuthHeaders(token),
          cache: 'no-store',
          signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load email submissions overview');
        }

        const payload = (await response.json()) as {
          success: boolean;
          data?: EmailSubmissionsOverviewDto;
        };

        if (!payload.success || !payload.data) {
          throw new Error('Invalid email submissions overview payload');
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

    window.addEventListener(EMAIL_SUBMISSIONS_OVERVIEW_REFRESH_EVENT, onRefresh);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener(EMAIL_SUBMISSIONS_OVERVIEW_REFRESH_EVENT, onRefresh);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(intervalId);
    };
  }, []);

  return { state, overview, isRefreshing, lastUpdatedAt };
}

export function notifyEmailSubmissionsOverviewRefresh() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(EMAIL_SUBMISSIONS_OVERVIEW_REFRESH_EVENT));
}
