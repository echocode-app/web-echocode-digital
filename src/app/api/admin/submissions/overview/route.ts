import { getAdminSubmissionsOverview } from '@/server/admin';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async () => {
    return getAdminSubmissionsOverview();
  },
  {
    permissions: 'submissions.read',
  },
);
