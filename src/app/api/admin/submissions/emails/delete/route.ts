import { softDeleteAdminEmailSubmission, emailSubmissionIdQuerySchema } from '@/server/forms/email-submission';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const DELETE = withAdminApi(
  async ({ auth, query }) => {
    return softDeleteAdminEmailSubmission({
      submissionId: query.submissionId,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema: emailSubmissionIdQuerySchema,
  },
);
