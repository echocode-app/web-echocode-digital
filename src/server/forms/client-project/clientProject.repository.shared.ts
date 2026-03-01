import { Timestamp } from 'firebase-admin/firestore';
import { ApiError } from '@/server/lib/errors';
import type { ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import { CLIENT_SUBMISSION_STATUS_VALUES } from '@/shared/admin/constants';

export const CLIENT_SUBMISSIONS_COLLECTION = 'client_submissions';

export const CLIENT_SUBMISSION_STATUS_ORDER: readonly ClientSubmissionStatus[] = [
  ...CLIENT_SUBMISSION_STATUS_VALUES,
];

export const FALLBACK_SCAN_PAGE_SIZE = 120;

export function toIso(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString();
}

export function assertTimestamp(value: unknown, label: string): asserts value is Timestamp {
  if (!(value instanceof Timestamp)) {
    throw ApiError.fromCode('INTERNAL_ERROR', `${label} timestamp is invalid`);
  }
}
