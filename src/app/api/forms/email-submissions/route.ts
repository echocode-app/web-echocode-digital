import { z } from 'zod';
import { withApi } from '@/server/lib';
import { applyPublicRateLimitStub } from '@/server/lib/rateLimit';
import { createEmailSubmission } from '@/server/forms/email-submission';

export const runtime = 'nodejs';

export const POST = withApi(
  async ({ req, body }) => {
    await applyPublicRateLimitStub({
      request: req,
      scope: 'forms.email-submissions.create',
    });

    return createEmailSubmission({
      rawBody: body,
      requestHeaders: req.headers,
    });
  },
  {
    auth: false,
    bodySchema: z.unknown(),
  },
);
