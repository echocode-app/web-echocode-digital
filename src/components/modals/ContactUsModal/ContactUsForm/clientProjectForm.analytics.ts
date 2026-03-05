const SESSION_STORAGE_KEY = 'echocode_client_session_id';
const CONTACT_MODAL_OPEN_DEDUP_KEY = 'echocode_contact_modal_open_last_at';
const CONTACT_MODAL_OPEN_DEDUP_MS = 1500;

function getClientSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  const fromStorage = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (fromStorage && fromStorage.trim().length > 0) {
    return fromStorage;
  }

  const created = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}

export function getClientAnalyticsSessionId(): string {
  return getClientSessionId();
}

export async function trackClientProjectModalEvent(
  eventType: 'contact_modal_open' | 'submit_project_attempt' | 'submit_project_error',
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

  const sessionId = getClientSessionId();

  try {
    await fetch('/api/forms/client-project/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-session-id': sessionId,
      },
      body: JSON.stringify({
        eventType,
        ...(metadata ? { metadata } : {}),
      }),
    });
  } catch {
    // best-effort analytics: do not break user flow
  }
}
