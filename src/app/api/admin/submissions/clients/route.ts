import { listAdminClientSubmissions } from '@/server/forms/client-project';
import { clientSubmissionListQuerySchema } from '@/server/forms/client-project';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ query }) => {
    return listAdminClientSubmissions(query);
  },
  {
    permissions: 'submissions.read',
    querySchema: clientSubmissionListQuerySchema,
  },
);
