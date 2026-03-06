'use client';

import { useEffect, useState } from 'react';
import { fetchAdminData } from '@/components/admin/api/fetchAdminData';
import type { DashboardGeographyDto, DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';

export type DashboardGeographyLoadState = 'idle' | 'loading' | 'ready' | 'error';

async function fetchDashboardGeography(
  period: DashboardPeriod,
  signal: AbortSignal,
): Promise<DashboardGeographyDto> {
  return fetchAdminData<DashboardGeographyDto>({
    url: `/api/admin/dashboard/geography?period=${period}`,
    signal,
    requestErrorMessage: 'Failed to fetch dashboard geography',
    payloadErrorMessage: 'Invalid dashboard geography payload',
  });
}

export function useDashboardGeography(period: DashboardPeriod, enabled: boolean) {
  const [geography, setGeography] = useState<DashboardGeographyDto | null>(null);
  const [state, setState] = useState<DashboardGeographyLoadState>(enabled ? 'loading' : 'idle');

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    fetchDashboardGeography(period, controller.signal)
      .then((data) => {
        setGeography(data);
        setState('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setGeography(null);
          setState('error');
        }
      });

    return () => controller.abort();
  }, [enabled, period]);

  return { geography, state };
}
