import { listAdminVacancySubmissions, vacancySubmissionListQuerySchema } from '@/server/forms/vacancy-submission';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ query }) => {
    return listAdminVacancySubmissions(query);
  },
  {
    permissions: 'submissions.read',
    querySchema: vacancySubmissionListQuerySchema,
  },
);
