import { listAdminVacancies } from '@/server/vacancies';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async () => {
    return listAdminVacancies();
  },
  {
    permissions: 'vacancies.manage',
  },
);
