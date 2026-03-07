'use client';

const SESSION_STORAGE_KEY = 'echocode_client_session_id';

function createClientSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getClientAnalyticsSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  const fromStorage = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (fromStorage && fromStorage.trim().length > 0) {
    return fromStorage;
  }

  const created = createClientSessionId();
  window.localStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}

export async function postClientAnalyticsEvent(
  url: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const sessionId = getClientAnalyticsSessionId();

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-session-id': sessionId,
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Best-effort analytics should never block the user flow.
  }
}
