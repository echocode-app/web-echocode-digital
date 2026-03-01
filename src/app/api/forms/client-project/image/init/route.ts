import { z } from 'zod';
import { withApi } from '@/server/lib';
import { applyPublicRateLimitStub } from '@/server/lib/rateLimit';
import { createClientProjectUploadInit } from '@/server/forms/client-project';

export const runtime = 'nodejs';

export const POST = withApi(
  async ({ req, body }) => {
    await applyPublicRateLimitStub({
      request: req,
      scope: 'forms.client-project.image.init',
    });

    return createClientProjectUploadInit({
      rawBody: body,
    });
  },
  {
    auth: false,
    bodySchema: z.unknown(),
  },
);
