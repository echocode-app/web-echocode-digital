'use client';

import { useEffect, useState } from 'react';
import { fetchAdminData } from '@/components/admin/api/fetchAdminData';
import type { EchocodeAppOverviewDto } from '@/server/admin/echocode-app';
import type { DashboardPeriod } from '@/server/admin/dashboard/dashboard.types';

export type EchocodeAppOverviewState = 'loading' | 'ready' | 'error';

async function fetchOverview(
  period: DashboardPeriod,
  signal: AbortSignal,
): Promise<EchocodeAppOverviewDto> {
  return fetchAdminData<EchocodeAppOverviewDto>({
    url: `/api/admin/echocode-app/overview?period=${period}`,
    signal,
    requestErrorMessage: 'Failed to fetch echocode.app analytics overview',
    payloadErrorMessage: 'Invalid echocode.app analytics payload',
  });
}

export function useEchocodeAppOverview(period: DashboardPeriod) {
  const [overview, setOverview] = useState<EchocodeAppOverviewDto | null>(null);
  const [state, setState] = useState<EchocodeAppOverviewState>('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetchOverview(period, controller.signal)
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
  }, [period]);

  return { overview, state };
}
