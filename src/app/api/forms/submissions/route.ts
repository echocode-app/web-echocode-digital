import { z } from 'zod';
import { withApi } from '@/server/lib';
import { createProjectSubmission } from '@/server/submissions';

export const runtime = 'nodejs';

export const POST = withApi(
  async ({ body, requestId }) => {
    return createProjectSubmission({
      rawBody: body,
      requestId,
    });
  },
  {
    auth: false,
    bodySchema: z.unknown(),
  },
);
