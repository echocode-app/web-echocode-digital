import { pageViewBodySchema, trackPageView } from '@/server/analytics';
import {
  appendCorsHeaders,
  buildPublicIngestCorsPolicy,
  createCorsPreflightHandler,
  getPublicIngestAllowedOriginPatterns,
  getPublicIngestAllowedOrigins,
  withApi,
} from '@/server/lib';
import { applyPublicRateLimitStub } from '@/server/lib/rateLimit';

export const runtime = 'nodejs';

const corsPolicy = buildPublicIngestCorsPolicy({
  allowedOrigins: getPublicIngestAllowedOrigins(),
  allowedOriginPatterns: getPublicIngestAllowedOriginPatterns(),
});
const handlePost = withApi(
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

export const OPTIONS = createCorsPreflightHandler(corsPolicy);

export async function POST(req: Parameters<typeof handlePost>[0]) {
  const response = await handlePost(req);
  return appendCorsHeaders(req, response, corsPolicy);
}
