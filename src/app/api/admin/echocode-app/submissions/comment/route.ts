import { z } from 'zod';
import { addAdminEchocodeAppSubmissionComment } from '@/server/admin';
import { moderationCommentSchema } from '@/server/forms/shared/moderation.validation';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

const querySchema = z.object({
  submissionId: z.string().trim().min(1),
});

export const POST = withAdminApi(
  async ({ auth, query, body }) => {
    return addAdminEchocodeAppSubmissionComment({
      submissionId: query.submissionId,
      comment: body.comment,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema,
    bodySchema: moderationCommentSchema,
  },
);
