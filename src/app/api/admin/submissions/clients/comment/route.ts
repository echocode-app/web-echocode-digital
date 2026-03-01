import { z } from 'zod';
import {
  addAdminClientSubmissionComment,
  addClientSubmissionCommentSchema,
} from '@/server/forms/client-project';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

const querySchema = z.object({
  submissionId: z.string().trim().min(1),
});

export const POST = withAdminApi(
  async ({ auth, query, body }) => {
    return addAdminClientSubmissionComment({
      submissionId: query.submissionId,
      comment: body.comment,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema,
    bodySchema: addClientSubmissionCommentSchema,
  },
);
