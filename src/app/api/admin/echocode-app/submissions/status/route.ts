import { z } from 'zod';
import { setAdminEchocodeAppSubmissionStatus } from '@/server/admin';
import { updateSubmissionStatusSchema } from '@/server/admin/admin-submissions.service';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

const querySchema = z.object({
  submissionId: z.string().trim().min(1),
});

export const PATCH = withAdminApi(
  async ({ auth, query, body }) => {
    return setAdminEchocodeAppSubmissionStatus({
      submissionId: query.submissionId,
      status: body.status,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema,
    bodySchema: updateSubmissionStatusSchema,
  },
);
