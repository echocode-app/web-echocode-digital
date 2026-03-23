import { softDeleteAdminClientSubmission } from '@/server/forms/client-project';
import { clientSubmissionIdQuerySchema } from '@/server/forms/client-project';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const DELETE = withAdminApi(
  async ({ auth, query }) => {
    return softDeleteAdminClientSubmission({
      submissionId: query.submissionId,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema: clientSubmissionIdQuerySchema,
  },
);
