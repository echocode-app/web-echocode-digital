import { listAdminEmailSubmissions, emailSubmissionListQuerySchema } from '@/server/forms/email-submission';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ query }) => {
    return listAdminEmailSubmissions(query);
  },
  {
    permissions: 'submissions.read',
    querySchema: emailSubmissionListQuerySchema,
  },
);
