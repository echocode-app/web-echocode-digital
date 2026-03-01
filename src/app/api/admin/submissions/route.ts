import { getAdminSubmissionsList } from '@/server/admin';
import { withAdminApi } from '@/server/lib';
import { listSubmissionsQuerySchema } from '@/server/submissions/submissions.list.service';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ query }) => {
    return getAdminSubmissionsList(query);
  },
  {
    permissions: 'submissions.read',
    querySchema: listSubmissionsQuerySchema,
  },
);
