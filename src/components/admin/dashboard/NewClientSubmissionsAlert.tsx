'use client';

import QueueModerationAlert from '@/components/admin/dashboard/queue-alerts/QueueModerationAlert';
import { useClientSubmissionsOverview } from '@/components/admin/client-submissions/useClientSubmissionsOverview';

export default function NewClientSubmissionsAlert() {
  const { overview, isRefreshing, lastUpdatedAt } = useClientSubmissionsOverview();

  return (
    <QueueModerationAlert
      href="/admin/submissions/clients"
      count={overview?.byStatus.new ?? 0}
      singularLabel="new client submission requires review"
      pluralLabel="new client submissions require review"
      queueLabel="Priority queue"
      updatedAt={lastUpdatedAt}
      isRefreshing={isRefreshing}
      variant="primary"
    />
  );
}
