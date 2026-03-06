import { z } from 'zod';
import { withApi } from '@/server/lib';
import { applyPublicRateLimitStub } from '@/server/lib/rateLimit';
import { createVacancySubmission } from '@/server/forms/vacancy-submission';

export const runtime = 'nodejs';

export const POST = withApi(
  async ({ req, body }) => {
    await applyPublicRateLimitStub({
      request: req,
      scope: 'forms.vacancy-submissions.create',
    });

    return createVacancySubmission({
      rawBody: body,
      requestHeaders: req.headers,
    });
  },
  {
    auth: false,
    bodySchema: z.unknown(),
  },
);
