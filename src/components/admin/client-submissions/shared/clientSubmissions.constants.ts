import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import { CLIENT_SUBMISSION_STATUS_VALUES } from '@/shared/admin/constants';

export const CLIENT_SUBMISSION_STATUS_OPTIONS: ClientSubmissionStatus[] = [
  ...CLIENT_SUBMISSION_STATUS_VALUES,
];

export const CLIENT_SUBMISSION_STATUS_SORT_PRIORITY: Record<ClientSubmissionStatus, number> = {
  new: 0,
  viewed: 1,
  deferred: 2,
  rejected: 3,
  processed: 4,
};

export const CLIENT_SUBMISSION_STATUS_BADGE_CLASS: Record<ClientSubmissionStatus, string> = {
  new: 'border-[#4b86ff] text-[#7ea7ff] bg-[#4b86ff]/10',
  viewed: 'border-gray60 text-gray60 bg-gray10',
  processed: 'border-[#3ecf8e] text-[#48d597] bg-[#3ecf8e]/10',
  rejected: 'border-[#ff6d7a] text-[#ff6d7a] bg-[#ff6d7a]/10',
  deferred: 'border-[#f6c453] text-[#f6c453] bg-[#f6c453]/10',
};

export function getAllowedStatusOptions(currentStatus: ClientSubmissionStatus): ClientSubmissionStatus[] {
  if (currentStatus === 'new') return CLIENT_SUBMISSION_STATUS_OPTIONS;
  return CLIENT_SUBMISSION_STATUS_OPTIONS.filter((status) => status !== 'new');
}
