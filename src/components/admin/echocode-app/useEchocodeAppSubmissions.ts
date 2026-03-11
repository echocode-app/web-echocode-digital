'use client';

import { useEffect, useState } from 'react';
import { fetchAdminData } from '@/components/admin/api/fetchAdminData';
import type { AdminDataTableColumn } from '@/components/admin/shared/table/AdminDataTable';
import type { EchocodeAppSubmissionsDto } from '@/server/admin/echocode-app';
import type { SubmissionListStatus } from '@/server/submissions/submissions.types';

export type EchocodeAppSubmissionsState = 'loading' | 'ready' | 'error';

export const ECHOCODE_APP_SUBMISSIONS_COLUMNS: AdminDataTableColumn[] = [
  { key: 'createdAt', label: 'Created' },
  { key: 'contact', label: 'Contact' },
  { key: 'status', label: 'Status' },
  { key: 'attachment', label: 'Attachment' },
  { key: 'site', label: 'Site' },
];

async function fetchSubmissions(
  page: number,
  status: SubmissionListStatus | 'all',
  signal: AbortSignal,
): Promise<EchocodeAppSubmissionsDto> {
  const params = new URLSearchParams({
    page: String(page),
    limit: '20',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  if (status !== 'all') {
    params.set('status', status);
  }

  return fetchAdminData<EchocodeAppSubmissionsDto>({
    url: `/api/admin/echocode-app/submissions?${params.toString()}`,
    signal,
    requestErrorMessage: 'Failed to fetch echocode.app submissions',
    payloadErrorMessage: 'Invalid echocode.app submissions payload',
  });
}

export function useEchocodeAppSubmissions() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<SubmissionListStatus | 'all'>('all');
  const [data, setData] = useState<EchocodeAppSubmissionsDto | null>(null);
  const [state, setState] = useState<EchocodeAppSubmissionsState>('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetchSubmissions(page, status, controller.signal)
      .then((payload) => {
        setData(payload);
        setState('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setData(null);
          setState('error');
        }
      });

    return () => controller.abort();
  }, [page, status]);

  return {
    page,
    status,
    data,
    state,
    setLoading: () => setState('loading'),
    setStatusAndResetPage: (nextStatus: SubmissionListStatus | 'all') => {
      setState('loading');
      setStatus(nextStatus);
      setPage(1);
    },
    goToPrevPage: () => {
      setState('loading');
      setPage((current) => Math.max(current - 1, 1));
    },
    goToNextPage: () => {
      setState('loading');
      setPage((current) => {
        const totalPages = data?.meta.totalPages ?? current;
        return Math.min(current + 1, totalPages);
      });
    },
  };
}
