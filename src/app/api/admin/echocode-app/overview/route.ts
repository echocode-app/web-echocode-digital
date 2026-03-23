import { z } from 'zod';
import { getAdminEchocodeAppOverview } from '@/server/admin';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ query }) => {
    return getAdminEchocodeAppOverview(query.period);
  },
  {
    permissions: 'admin.access',
    querySchema: z.object({
      period: z.enum(['week', 'month', 'year']).default('week'),
    }),
  },
);
