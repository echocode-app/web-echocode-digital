import { deleteAdminPortfolioPreviewProject } from '@/server/portfolio';
import { withAdminApi } from '@/server/lib';
import { ApiError } from '@/server/lib/errors';

export const runtime = 'nodejs';

export const DELETE = withAdminApi(
  async ({ auth, req }) => {
    const segments = req.nextUrl.pathname.split('/').filter(Boolean);
    const projectId = decodeURIComponent(segments[segments.length - 1] ?? '').trim();

    if (!projectId) {
      throw ApiError.fromCode('BAD_REQUEST', 'Missing projectId path parameter');
    }

    return deleteAdminPortfolioPreviewProject({
      projectId,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'portfolio.manage',
  },
);
