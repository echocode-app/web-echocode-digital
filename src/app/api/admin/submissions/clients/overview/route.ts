import { getAdminClientSubmissionsOverview } from '@/server/forms/client-project';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async () => {
    return getAdminClientSubmissionsOverview();
  },
  {
    permissions: 'submissions.read',
  },
);
