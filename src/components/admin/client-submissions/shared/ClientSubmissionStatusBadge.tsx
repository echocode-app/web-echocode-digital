import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import { CLIENT_SUBMISSION_STATUS_BADGE_CLASS } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';

type ClientSubmissionStatusBadgeProps = {
  status: ClientSubmissionStatus;
};

export default function ClientSubmissionStatusBadge({ status }: ClientSubmissionStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-main-xs ${CLIENT_SUBMISSION_STATUS_BADGE_CLASS[status]}`}>
      {status}
    </span>
  );
}
