const CONTACT_MODAL_OPEN_DEDUP_KEY = 'echocode_contact_modal_open_last_at';
const CONTACT_MODAL_OPEN_DEDUP_MS = 1500;
import {
  getClientAnalyticsSessionId as getSharedClientAnalyticsSessionId,
  postClientAnalyticsEvent,
} from '@/components/analytics/clientAnalytics';

export function getClientAnalyticsSessionId(): string {
  return getSharedClientAnalyticsSessionId();
}

export async function trackClientProjectModalEvent(
  eventType:
    | 'contact_modal_open'
    | 'contact_modal_close'
    | 'contact_modal_cta_click'
    | 'submit_project_attempt'
    | 'submit_project_error',
  metadata?: Record<string, unknown>,
): Promise<void> {
  if (eventType === 'contact_modal_open' && typeof window !== 'undefined') {
    const lastOpenRaw = window.sessionStorage.getItem(CONTACT_MODAL_OPEN_DEDUP_KEY);
    const lastOpenTs = lastOpenRaw ? Number(lastOpenRaw) : Number.NaN;
    const now = Date.now();

    if (Number.isFinite(lastOpenTs) && now - lastOpenTs < CONTACT_MODAL_OPEN_DEDUP_MS) {
      return;
    }

    window.sessionStorage.setItem(CONTACT_MODAL_OPEN_DEDUP_KEY, String(now));
  }

  await postClientAnalyticsEvent('/api/forms/client-project/analytics', {
    eventType,
    ...(metadata ? { metadata } : {}),
  });
}
