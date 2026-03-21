import { createAdminAccess, createAdminAccessSchema, listAdminAccess } from '@/server/admin';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async () => {
    return listAdminAccess();
  },
  {
    permissions: 'admin.settings.read',
  },
);

export const POST = withAdminApi(
  async ({ auth, body }) => {
    return createAdminAccess(auth, body);
  },
  {
    permissions: 'admin.settings',
    bodySchema: createAdminAccessSchema,
  },
);
