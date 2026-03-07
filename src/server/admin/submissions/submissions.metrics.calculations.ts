import { normalizeSafeNumber, percentage } from '@/server/admin/dashboard/dashboard.repository.core';
import type { FunnelRaw } from '@/server/admin/submissions/submissions.metrics.types';

export function buildFunnelSnapshot(modalOpen: number, submitAttempt: number, submitSuccess: number): FunnelRaw {
  const normalizedModalOpen = normalizeSafeNumber(modalOpen);
  const normalizedSubmitAttempt = normalizeSafeNumber(submitAttempt);
  const normalizedSubmitSuccess = normalizeSafeNumber(submitSuccess);
  const baseline = normalizedModalOpen > 0 ? normalizedModalOpen : normalizedSubmitAttempt;

  const conversionRate = percentage(normalizedSubmitSuccess, baseline);
  const rawDropOff = baseline > 0
    ? percentage(Math.max(baseline - normalizedSubmitSuccess, 0), baseline)
    : 0;

  return {
    modalOpen: normalizedModalOpen,
    submitAttempt: normalizedSubmitAttempt,
    submitSuccess: normalizedSubmitSuccess,
    conversionRate,
    dropOffRate: Number(rawDropOff.toFixed(2)),
  };
}
