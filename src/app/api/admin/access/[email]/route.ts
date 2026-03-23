import { updateAdminAccess, updateAdminAccessSchema } from '@/server/admin';
import { withAdminApi } from '@/server/lib';
import { ApiError } from '@/server/lib/errors';

export const runtime = 'nodejs';

export const PATCH = withAdminApi(
  async ({ auth, req, body }) => {
    const segments = req.nextUrl.pathname.split('/').filter(Boolean);
    const normalizedEmail = decodeURIComponent(segments[segments.length - 1] ?? '').trim();

    if (!normalizedEmail) {
      throw ApiError.fromCode('BAD_REQUEST', 'Missing email path parameter');
    }

    return updateAdminAccess(auth, normalizedEmail, body);
  },
  {
    permissions: 'admin.settings',
    bodySchema: updateAdminAccessSchema,
  },
);
