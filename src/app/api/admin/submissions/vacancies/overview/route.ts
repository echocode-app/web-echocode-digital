import { getAdminVacancySubmissionsOverview } from '@/server/forms/vacancy-submission';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async () => {
    return getAdminVacancySubmissionsOverview();
  },
  {
    permissions: 'submissions.read',
  },
);
