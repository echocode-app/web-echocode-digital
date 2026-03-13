'use client';

import { useEffect, useState } from 'react';
import { fetchAdminData } from '@/components/admin/api/fetchAdminData';
import type {
  DashboardPeriod,
  DashboardSiteSliceOverviewDto,
} from '@/server/admin/dashboard/dashboard.types';

export type DashboardSiteSliceLoadState = 'loading' | 'ready' | 'error';

async function fetchDashboardSiteSliceOverview(
  period: DashboardPeriod,
  signal: AbortSignal,
): Promise<DashboardSiteSliceOverviewDto> {
  return fetchAdminData<DashboardSiteSliceOverviewDto>({
    url: `/api/admin/dashboard/site-slice?period=${period}`,
    signal,
    requestErrorMessage: 'Failed to fetch dashboard site slice overview',
    payloadErrorMessage: 'Invalid dashboard site slice payload',
  });
}

export function useDashboardSiteSliceOverview(period: DashboardPeriod, enabled = true) {
  const [overview, setOverview] = useState<DashboardSiteSliceOverviewDto | null>(null);
  const [state, setState] = useState<DashboardSiteSliceLoadState>(
    enabled ? 'loading' : ('idle' as DashboardSiteSliceLoadState),
  );

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const controller = new AbortController();

    fetchDashboardSiteSliceOverview(period, controller.signal)
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
  }, [enabled, period]);

  return { overview, state };
}
