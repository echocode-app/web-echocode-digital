'use client';

import QueueModerationAlert from '@/components/admin/dashboard/queue-alerts/QueueModerationAlert';
import { useEmailSubmissionsOverview } from '@/components/admin/email-submissions/useEmailSubmissionsOverview';

export default function NewEmailSubmissionsAlert() {
  const { overview, isRefreshing, lastUpdatedAt } = useEmailSubmissionsOverview();

  return (
    <QueueModerationAlert
      href="/admin/submissions/emails"
      count={overview?.byStatus.new ?? 0}
      singularLabel="new email submission requires review"
      pluralLabel="new email submissions require review"
      queueLabel="Email queue"
      updatedAt={lastUpdatedAt}
      isRefreshing={isRefreshing}
      variant="tertiary"
    />
  );
}
