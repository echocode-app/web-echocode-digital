import { logger } from '@/server/lib/logger';

const HONEYPOT_FIELDS = ['address'];

export function isHoneypotTripped(rawBody: unknown): boolean {
  if (typeof rawBody !== 'object' || rawBody === null || Array.isArray(rawBody)) {
    return false;
  }

  const body = rawBody as Record<string, unknown>;

  return HONEYPOT_FIELDS.some((field) => {
    const value = body[field];

    return typeof value === 'string' && value.trim().length > 0;
  });
}

export function logHoneypotCrmSkip(
  formName: string,
  input: { submissionId: string; rawBody: unknown },
) {
  logger.warn('crm_skipped_by_honeypot', {
    formName,
    submissionId: input.submissionId,
    honeypotFields: HONEYPOT_FIELDS.filter((field) => {
      const value = (input.rawBody as Record<string, unknown>)?.[field];
      return typeof value === 'string' && value.trim().length > 0;
    }),
  });
}
