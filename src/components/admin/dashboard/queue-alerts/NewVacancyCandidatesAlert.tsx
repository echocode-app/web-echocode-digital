'use client';

import QueueModerationAlert from '@/components/admin/dashboard/queue-alerts/QueueModerationAlert';
import { useVacancyCandidatesOverview } from '@/components/admin/vacancy-candidates/useVacancyCandidatesOverview';

export default function NewVacancyCandidatesAlert() {
  const { overview, isRefreshing, lastUpdatedAt } = useVacancyCandidatesOverview();

  return (
    <QueueModerationAlert
      href="/admin/vacancies/candidates"
      count={overview?.byStatus.new ?? 0}
      singularLabel="new vacancy candidate submission requires review"
      pluralLabel="new vacancy candidate submissions require review"
      queueLabel="Vacancy candidates"
      updatedAt={lastUpdatedAt}
      isRefreshing={isRefreshing}
      variant="secondary"
    />
  );
}
