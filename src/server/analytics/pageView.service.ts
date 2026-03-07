import { trackEventBestEffort } from '@/server/analytics/trackEvent.service';
import type { PageViewBodyInput } from '@/server/analytics/pageView.validation';

const DEFAULT_PAGE_VIEW_SOURCE = 'website';
const SESSION_ID_HEADER = 'x-client-session-id';

function normalizeOptionalString(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function getClientSessionId(headers: Headers): string | null {
  return normalizeOptionalString(headers.get(SESSION_ID_HEADER));
}

export async function trackPageView(input: {
  body: PageViewBodyInput;
  requestHeaders: Headers;
}): Promise<{ ok: true }> {
  const source = normalizeOptionalString(input.body.source) ?? DEFAULT_PAGE_VIEW_SOURCE;
  const sessionId = getClientSessionId(input.requestHeaders);

  await trackEventBestEffort({
    eventType: 'page_view',
    headers: input.requestHeaders,
    source,
    metadata: {
      path: input.body.path,
      url: input.body.url,
      title: input.body.title ?? null,
      referrer: input.body.referrer ?? null,
      source,
      ...(sessionId ? { sessionId } : {}),
    },
  });

  return { ok: true };
}
