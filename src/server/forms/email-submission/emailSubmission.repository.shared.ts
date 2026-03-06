import { MODERATION_STATUSES } from '@/server/forms/shared/moderation.types';

export const EMAIL_SUBMISSIONS_COLLECTION = 'email_submissions';
export const EMAIL_SUBMISSION_STATUS_ORDER = MODERATION_STATUSES;
export const EMAIL_FALLBACK_SCAN_PAGE_SIZE = 200;

export function isEmailSubmissionSoftDeleted(data: Record<string, unknown>): boolean {
  return data.isDeleted === true;
}
