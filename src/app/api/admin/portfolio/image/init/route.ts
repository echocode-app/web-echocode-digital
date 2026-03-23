import { createPortfolioImageUploadInit } from '@/server/portfolio';
import { withAdminApi } from '@/server/lib';
import { z } from 'zod';

export const runtime = 'nodejs';

export const POST = withAdminApi(
  async ({ body }) => {
    return createPortfolioImageUploadInit({
      rawBody: body,
    });
  },
  {
    permissions: 'portfolio.manage',
    bodySchema: z.unknown(),
  },
);
