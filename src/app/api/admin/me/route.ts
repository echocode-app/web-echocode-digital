import { getAdminMe } from '@/server/admin';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ auth }) => {
    return getAdminMe(auth);
  },
  {
    permissions: 'admin.access',
  },
);

// curl http://localhost:3000/api/admin/me
