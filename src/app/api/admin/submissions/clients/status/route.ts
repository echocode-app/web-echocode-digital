import { z } from 'zod';
import { setAdminClientSubmissionStatus, updateClientSubmissionStatusSchema } from '@/server/forms/client-project';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

const querySchema = z.object({
  submissionId: z.string().trim().min(1),
});

export const PATCH = withAdminApi(
  async ({ auth, query, body }) => {
    return setAdminClientSubmissionStatus({
      submissionId: query.submissionId,
      status: body.status,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema,
    bodySchema: updateClientSubmissionStatusSchema,
  },
);
