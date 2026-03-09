import {
  createAdminPortfolioPreviewProject,
  createAdminPortfolioPreviewProjectSchema,
  listAdminPortfolioPreviewProjects,
} from '@/server/portfolio';
import { withAdminApi } from '@/server/lib';

export const runtime = 'nodejs';

export const GET = withAdminApi(
  async () => {
    return listAdminPortfolioPreviewProjects();
  },
  {
    permissions: 'portfolio.manage',
  },
);

export const POST = withAdminApi(
  async ({ auth, body }) => {
    return createAdminPortfolioPreviewProject({
      ...body,
      adminUid: auth.uid,
      adminEmail: auth.email,
    });
  },
  {
    permissions: 'portfolio.manage',
    bodySchema: createAdminPortfolioPreviewProjectSchema,
  },
);
