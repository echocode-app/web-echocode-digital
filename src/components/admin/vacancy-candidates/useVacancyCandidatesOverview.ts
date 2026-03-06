'use client';

import { useCallback, useEffect, useState } from 'react';
import type { VacancySubmissionsOverviewDto } from '@/server/forms/vacancy-submission/vacancySubmission.types';
import {
  getAdminIdTokenOrThrow,
  withAuthHeaders,
} from '@/components/admin/moderation/shared/adminModeration.api';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';

type LoadState = 'loading' | 'ready' | 'error';
const VACANCY_CANDIDATES_OVERVIEW_REFRESH_EVENT = 'vacancy-candidates:overview-refresh';
const POLL_INTERVAL_MS = 15000;
const FALLBACK_OVERVIEW: VacancySubmissionsOverviewDto = {
  totals: {
    currentMonth: 0,
    allTime: 0,
  },
  byStatus: { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS },
  statusesByMonth: [],
  byVacancy: [],
};

export function useVacancyCandidatesOverview() {
  const [state, setState] = useState<LoadState>('loading');
  const [overview, setOverview] = useState<VacancySubmissionsOverviewDto | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const fetchOverview = useCallback((signal: AbortSignal) => {
    getAdminIdTokenOrThrow()
      .then(async (token) => {
        if (!signal.aborted) {
          setIsRefreshing(true);
        }

        const response = await fetch('/api/admin/vacancies/candidates/overview', {
          method: 'GET',
          headers: withAuthHeaders(token),
          cache: 'no-store',
          signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load candidate submissions overview');
        }

        const payload = (await response.json()) as {
          success: boolean;
          data?: VacancySubmissionsOverviewDto;
        };

        if (!payload.success || !payload.data) {
          throw new Error('Invalid vacancy candidates overview payload');
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

    window.addEventListener(VACANCY_CANDIDATES_OVERVIEW_REFRESH_EVENT, onRefresh);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener(VACANCY_CANDIDATES_OVERVIEW_REFRESH_EVENT, onRefresh);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(intervalId);
    };
  }, []);

  return { state, overview, isRefreshing, lastUpdatedAt };
}

export function notifyVacancyCandidatesOverviewRefresh() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(VACANCY_CANDIDATES_OVERVIEW_REFRESH_EVENT));
}
