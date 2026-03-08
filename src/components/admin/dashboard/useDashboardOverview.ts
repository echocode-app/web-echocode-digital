'use client';

import { useEffect, useState } from 'react';
import { fetchAdminData } from '@/components/admin/api/fetchAdminData';
import type {
  DashboardOverviewDto,
  DashboardPeriod,
} from '@/server/admin/dashboard/dashboard.types';

export type DashboardOverviewLoadState = 'loading' | 'ready' | 'error';

async function fetchDashboardOverview(
  period: DashboardPeriod,
  signal: AbortSignal,
): Promise<DashboardOverviewDto> {
  return fetchAdminData<DashboardOverviewDto>({
    url: `/api/admin/dashboard/overview?period=${period}`,
    signal,
    requestErrorMessage: 'Failed to fetch dashboard overview',
    payloadErrorMessage: 'Invalid dashboard payload',
  });
}

export function useDashboardOverview(period: DashboardPeriod = 'week') {
  const [overview, setOverview] = useState<DashboardOverviewDto | null>(null);
  const [state, setState] = useState<DashboardOverviewLoadState>('loading');
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchDashboardOverview(period, controller.signal)
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
  }, [period, refreshTick]);

  useEffect(() => {
    const refresh = () => setRefreshTick((prev) => prev + 1);

    window.addEventListener('admin-dashboard-refresh', refresh);
    return () => window.removeEventListener('admin-dashboard-refresh', refresh);
  }, []);

  return { overview, state };
}
