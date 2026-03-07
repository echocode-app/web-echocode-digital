import { pageViewBodySchema, trackPageView } from '@/server/analytics';
import { withApi } from '@/server/lib';
import { applyPublicRateLimitStub } from '@/server/lib/rateLimit';

export const runtime = 'nodejs';

export const POST = withApi(
  async ({ req, body }) => {
    await applyPublicRateLimitStub({
      request: req,
      scope: 'analytics.page-view',
    });

    return trackPageView({
      body,
      requestHeaders: req.headers,
    });
  },
  {
    auth: false,
    bodySchema: pageViewBodySchema,
  },
);
