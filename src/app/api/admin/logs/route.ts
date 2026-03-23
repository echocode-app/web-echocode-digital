import { withAdminApi } from '@/server/lib';
import { listAdminLogs, listAdminLogsQuerySchema } from '@/server/admin/admin-logs.service';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async ({ query }) => {
    return listAdminLogs(query);
  },
  {
    permissions: 'admin.logs.read',
    querySchema: listAdminLogsQuerySchema,
  },
);
