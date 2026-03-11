'use client';

import { useMemo } from 'react';
import { useClientSubmissionsOverview } from '@/components/admin/client-submissions/useClientSubmissionsOverview';
import { useEchocodeAppSubmissionsOverview } from '@/components/admin/echocode-app/useEchocodeAppSubmissionsOverview';
import { useEmailSubmissionsOverview } from '@/components/admin/email-submissions/useEmailSubmissionsOverview';
import { useVacancyCandidatesOverview } from '@/components/admin/vacancy-candidates/useVacancyCandidatesOverview';

export function useAdminSidebarBadges() {
  const clientOverview = useClientSubmissionsOverview();
  const emailOverview = useEmailSubmissionsOverview();
  const candidateOverview = useVacancyCandidatesOverview();
  const echocodeAppOverview = useEchocodeAppSubmissionsOverview();

  return useMemo(
    () => ({
      '/admin/submissions/clients': clientOverview.overview?.byStatus.new ?? 0,
      '/admin/submissions/emails': emailOverview.overview?.byStatus.new ?? 0,
      '/admin/vacancies/candidates': candidateOverview.overview?.byStatus.new ?? 0,
      '/admin/echocode-app/submissions': echocodeAppOverview.overview?.byStatus.new ?? 0,
    }),
    [
      candidateOverview.overview?.byStatus.new,
      clientOverview.overview?.byStatus.new,
      echocodeAppOverview.overview?.byStatus.new,
      emailOverview.overview?.byStatus.new,
    ],
  );
}
