'use client';

import QueueModerationAlert from '@/components/admin/dashboard/queue-alerts/QueueModerationAlert';
import { useEchocodeAppSubmissionsOverview } from '@/components/admin/echocode-app/useEchocodeAppSubmissionsOverview';

export default function NewEchocodeAppSubmissionsAlert() {
  const { overview, isRefreshing, lastUpdatedAt } = useEchocodeAppSubmissionsOverview();

  return (
    <QueueModerationAlert
      href="/admin/echocode-app/submissions"
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
