import { getAdminDashboardOverview } from '@/server/admin';
import { withAdminApi } from '@/server/lib';
import { z } from 'zod';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ query }) => {
    return getAdminDashboardOverview(query.period);
  },
  {
    permissions: 'admin.access',
    querySchema: z.object({
      period: z.enum(['week', 'month', 'year']).default('week'),
    }),
  },
);

// http://localhost:3000/admin/dashboard?mockDashboard=1   ---> mock
