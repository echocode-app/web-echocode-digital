import { softDeleteAdminVacancySubmission, vacancySubmissionIdQuerySchema } from '@/server/forms/vacancy-submission';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const DELETE = withAdminApi(
  async ({ auth, query }) => {
    return softDeleteAdminVacancySubmission({
      submissionId: query.submissionId,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'submissions.update',
    querySchema: vacancySubmissionIdQuerySchema,
  },
);
