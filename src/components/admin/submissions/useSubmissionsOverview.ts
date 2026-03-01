'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [overview, setOverview] = useState<SubmissionsOverviewDto | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetchSubmissionsOverview(controller.signal)
      .then((data) => {
        setOverview(data);
        setState('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setOverview(null);
          setState('error');
        }
      });

    return () => controller.abort();
  }, []);

  const activeOverview = overview;
  const activeState: LoadState = state;
  const readyOverview = useMemo(() => buildReadyOverview(activeOverview), [activeOverview]);

  return {
    activeState,
    readyOverview,
  };
}
