import type { SubmissionListStatus } from '@/server/submissions/submissions.types';

export const ECHOCODE_APP_SUBMISSION_STATUS_OPTIONS: SubmissionListStatus[] = [
  'new',
  'viewed',
  'processed',
  'rejected',
  'deferred',
];

export const ECHOCODE_APP_SUBMISSION_STATUS_BADGE_CLASS: Record<SubmissionListStatus, string> = {
  new: 'border-[#4b86ff] text-[#7ea7ff] bg-[#4b86ff]/10',
  viewed: 'border-gray60 text-gray60 bg-gray10',
  processed: 'border-[#3ecf8e] text-[#48d597] bg-[#3ecf8e]/10',
  rejected: 'border-[#ff6d7a] text-[#ff6d7a] bg-[#ff6d7a]/10',
  deferred: 'border-[#f6c453] text-[#f6c453] bg-[#f6c453]/10',
};

export const ECHOCODE_APP_SUBMISSION_STATUS_SORT_PRIORITY: Record<SubmissionListStatus, number> = {
  new: 0,
  viewed: 1,
  processed: 2,
  rejected: 3,
  deferred: 4,
};

export function getAllowedStatusOptions(
  currentStatus: SubmissionListStatus,
): SubmissionListStatus[] {
  if (currentStatus === 'new') return ECHOCODE_APP_SUBMISSION_STATUS_OPTIONS;
  return ECHOCODE_APP_SUBMISSION_STATUS_OPTIONS.filter((status) => status !== 'new');
}
