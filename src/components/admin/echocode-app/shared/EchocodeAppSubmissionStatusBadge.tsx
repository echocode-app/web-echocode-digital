import type { SubmissionListStatus } from '@/server/submissions/submissions.types';
import { ECHOCODE_APP_SUBMISSION_STATUS_BADGE_CLASS } from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.constants';

export default function EchocodeAppSubmissionStatusBadge({
  status,
}: {
  status: SubmissionListStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 
      font-main text-main-xs uppercase tracking-[0.08em] 
      ${ECHOCODE_APP_SUBMISSION_STATUS_BADGE_CLASS[status]}`}
    >
      {status}
    </span>
  );
}
