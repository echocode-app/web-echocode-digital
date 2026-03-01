import { z } from 'zod';
import { setAdminSubmissionStatus, updateSubmissionStatusSchema } from '@/server/admin';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

const querySchema = z.object({
  submissionId: z.string().trim().min(1),
});

export const PATCH = withAdminApi(
  async ({ auth, query, body }) => {
    return setAdminSubmissionStatus({
      submissionId: query.submissionId,
      payload: body,
      adminUid: auth.uid,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema,
    bodySchema: updateSubmissionStatusSchema,
  },
);
