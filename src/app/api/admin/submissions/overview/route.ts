import { getAdminSubmissionsOverview } from '@/server/admin';
import { withAdminApi } from '@/server/lib';
import { z } from 'zod';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ query }) => {
    return getAdminSubmissionsOverview(query.period);
  },
  {
    permissions: 'submissions.read',
    querySchema: z.object({
      period: z.enum(['week', 'month', 'year']).default('week'),
    }),
  },
);
