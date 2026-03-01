import { getAdminDashboardOverview } from '@/server/admin';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async () => {
    return getAdminDashboardOverview();
  },
  {
    permissions: 'admin.access',
  },
);

// http://localhost:3000/admin/dashboard?mockDashboard=1   ---> mock