import { getAdminEchocodeAppSubmissionsOverview } from '@/server/admin/echocode-app';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async () => {
    return getAdminEchocodeAppSubmissionsOverview();
  },
  {
    permissions: 'submissions.read',
  },
);
