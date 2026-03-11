import { listSubmissionsQuerySchema } from '@/server/submissions/submissions.list.service';
import { listAdminEchocodeAppSubmissions } from '@/server/admin';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ query }) => {
    return listAdminEchocodeAppSubmissions(query);
  },
  {
    permissions: 'submissions.read',
    querySchema: listSubmissionsQuerySchema.omit({ siteId: true }),
  },
);
