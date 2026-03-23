import { z } from 'zod';
import {
  addAdminVacancySubmissionComment,
  addVacancySubmissionCommentSchema,
} from '@/server/forms/vacancy-submission';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

const querySchema = z.object({
  submissionId: z.string().trim().min(1),
});

export const POST = withAdminApi(
  async ({ auth, query, body }) => {
    return addAdminVacancySubmissionComment({
      submissionId: query.submissionId,
      comment: body.comment,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema,
    bodySchema: addVacancySubmissionCommentSchema,
  },
);
