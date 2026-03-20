import type { SubmissionWorkflowStatus } from '@/server/submissions/submissions.types';

export const SITE_ID = 'echocode_app' as const;
export const SITE_HOST = 'echocode.app';
export const MAX_LIST_ROWS = 8;
export const FALLBACK_SCAN_PAGE_SIZE = 40;
export const SUBMISSIONS_OVERVIEW_CACHE_TTL_MS = 20_000;

export const STATUS_ORDER: Record<SubmissionWorkflowStatus, number> = {
  new: 0,
  viewed: 1,
  processed: 2,
  rejected: 3,
  deferred: 4,
};
