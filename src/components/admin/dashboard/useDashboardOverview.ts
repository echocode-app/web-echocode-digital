'use client';

import { useEffect, useState } from 'react';
import type { DashboardOverviewDto } from '@/server/admin/dashboard/dashboard.types';
import { getFirebaseClientAuth } from '@/lib/firebase/client';

export type DashboardOverviewLoadState = 'loading' | 'ready' | 'error';

async function fetchDashboardOverview(signal: AbortSignal): Promise<DashboardOverviewDto> {
  const auth = getFirebaseClientAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Unauthorized');
  }

  const token = await user.getIdToken(true);

  const response = await fetch('/api/admin/dashboard/overview', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard overview');
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: DashboardOverviewDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid dashboard payload');
  }

  return payload.data;
}

export function useDashboardOverview() {
  const [overview, setOverview] = useState<DashboardOverviewDto | null>(null);
  const [state, setState] = useState<DashboardOverviewLoadState>('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetchDashboardOverview(controller.signal)
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

  return { overview, state };
}
