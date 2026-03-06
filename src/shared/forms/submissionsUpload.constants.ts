/** Shared tmp upload prefix for form attachments before submission is finalized. */
export const SUBMISSIONS_TMP_UPLOAD_PREFIX = 'uploads/submissions/tmp/';

/** Strict UUID-based tmp object path format used by signed upload flow. */
export const SUBMISSIONS_TMP_UPLOAD_PATH_PATTERN = /^uploads\/submissions\/tmp\/[0-9a-f-]{36}$/;

/** Signed URL expiration for upload init endpoint (10 minutes). */
export const SUBMISSIONS_UPLOAD_URL_TTL_MS = 10 * 60 * 1000;
