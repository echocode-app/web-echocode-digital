import { z } from 'zod';
import { withApi } from '@/server/lib';
import { createProjectSubmission } from '@/server/submissions';

export const runtime = 'nodejs';

export const POST = withApi(
  async ({ req, body }) => {
    return createProjectSubmission({
      rawBody: body,
      requestHeaders: req.headers,
    });
  },
  {
    auth: false,
    bodySchema: z.unknown(),
  },
);
