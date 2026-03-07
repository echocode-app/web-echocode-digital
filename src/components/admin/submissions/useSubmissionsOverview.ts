'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchAdminData } from '@/components/admin/api/fetchAdminData';
import { buildReadyOverview } from '@/components/admin/submissions/submissions.overview.utils';
import type {
  SubmissionsOverviewDto,
  SubmissionsPeriod,
} from '@/server/admin/submissions/submissions.metrics.service';

export type LoadState = 'loading' | 'ready' | 'error';

async function fetchSubmissionsOverview(
  period: SubmissionsPeriod,
  signal: AbortSignal,
): Promise<SubmissionsOverviewDto> {
  return fetchAdminData<SubmissionsOverviewDto>({
    url: `/api/admin/submissions/overview?period=${period}`,
    signal,
    requestErrorMessage: 'Failed to fetch submissions overview',
    payloadErrorMessage: 'Invalid submissions overview payload',
  });
}

export function useSubmissionsOverview(period: SubmissionsPeriod = 'week') {
  const [overview, setOverview] = useState<SubmissionsOverviewDto | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetchSubmissionsOverview(period, controller.signal)
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

  const activeOverview = overview;
  const activeState: LoadState = state;
  const readyOverview = useMemo(() => buildReadyOverview(activeOverview), [activeOverview]);

  return {
    activeState,
    readyOverview,
  };
}
