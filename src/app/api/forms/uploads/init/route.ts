import { z } from 'zod';
import { withApi } from '@/server/lib';
import { createProjectUploadInit } from '@/server/submissions';

export const runtime = 'nodejs';

export const POST = withApi(
  async ({ body }) => {
    return createProjectUploadInit({
      rawBody: body,
    });
  },
  {
    auth: false,
    bodySchema: z.unknown(),
  },
);
