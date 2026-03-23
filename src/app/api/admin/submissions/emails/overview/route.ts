import { getAdminEmailSubmissionsOverview } from '@/server/forms/email-submission';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async () => {
    return getAdminEmailSubmissionsOverview();
  },
  {
    permissions: 'submissions.read',
  },
);
