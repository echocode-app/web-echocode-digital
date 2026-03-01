'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { SUBMISSIONS_OVERVIEW_MOCK } from '@/components/admin/submissions/mockOverview';
import { SUBMISSIONS_MOCK_QUERY_KEY } from '@/components/admin/submissions/submissions.config';
import { buildReadyOverview } from '@/components/admin/submissions/submissions.overview.utils';
import type { SubmissionsOverviewDto } from '@/server/admin/submissions/submissions.metrics.service';
import { getFirebaseClientAuth } from '@/lib/firebase/client';

export type LoadState = 'loading' | 'ready' | 'error';

async function fetchSubmissionsOverview(signal: AbortSignal): Promise<SubmissionsOverviewDto> {
  const auth = getFirebaseClientAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Unauthorized');
  }

  const token = await user.getIdToken(true);

  const response = await fetch('/api/admin/submissions/overview', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch submissions overview');
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: SubmissionsOverviewDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid submissions overview payload');
  }

  return payload.data;
}

export function useSubmissionsOverview() {
  const searchParams = useSearchParams();
  const useMockMode = searchParams.get(SUBMISSIONS_MOCK_QUERY_KEY) === '1';
  const [overview, setOverview] = useState<SubmissionsOverviewDto | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    if (useMockMode) return;

    const controller = new AbortController();

    fetchSubmissionsOverview(controller.signal)
      .then((data) => {
        setOverview(data);
        setState('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setOverview(SUBMISSIONS_OVERVIEW_MOCK);
          setState('ready');
        }
      });

    return () => controller.abort();
  }, [useMockMode]);

  const activeOverview = useMockMode ? SUBMISSIONS_OVERVIEW_MOCK : overview;
  const activeState: LoadState = useMockMode ? 'ready' : state;
  const readyOverview = useMemo(() => buildReadyOverview(activeOverview), [activeOverview]);

  return {
    activeState,
    readyOverview,
  };
}
