import { z } from 'zod';
import { trackEventBestEffort } from '@/server/analytics';
import { withApi } from '@/server/lib';

export const runtime = 'nodejs';

const bodySchema = z.object({
  eventType: z.enum([
    'contact_modal_open',
    'contact_modal_close',
    'contact_modal_cta_click',
    'submit_project_attempt',
    'submit_project_error',
  ]),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const POST = withApi(
  async ({ body, req }) => {
    const sessionId = req.headers.get('x-client-session-id')?.trim() || null;

    await trackEventBestEffort({
      eventType: body.eventType,
      headers: req.headers,
      metadata: {
        ...(body.metadata ?? {}),
        source: 'client_project_modal',
        ...(sessionId ? { sessionId } : {}),
      },
    });

    return { ok: true };
  },
  {
    bodySchema,
  },
);
