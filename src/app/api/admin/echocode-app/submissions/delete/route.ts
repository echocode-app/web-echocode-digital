import { z } from 'zod';
import { softDeleteAdminEchocodeAppSubmission } from '@/server/admin';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

const querySchema = z.object({
  submissionId: z.string().trim().min(1),
});

export const DELETE = withAdminApi(
  async ({ auth, query }) => {
    return softDeleteAdminEchocodeAppSubmission({
      submissionId: query.submissionId,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema,
  },
);
