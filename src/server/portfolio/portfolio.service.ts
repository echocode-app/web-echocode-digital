import { logAdminAction } from '@/server/admin/admin-logs.service';
import {
  countEffectivePortfolioItems,
  createManagedPortfolioPreviewProject,
  deleteManagedPortfolioPreviewProject,
  listManagedPortfolioPreviewProjects,
  listPublicPortfolioPreviewProjects,
} from '@/server/portfolio/portfolio.repository';
import type {
  AdminPortfolioPreviewProjectDto,
  CreateAdminPortfolioPreviewProjectInput,
  DeleteAdminPortfolioPreviewProjectInput,
  PortfolioPreviewProjectItem,
} from '@/server/portfolio/portfolio.types';

export async function listAdminPortfolioPreviewProjects(): Promise<
  AdminPortfolioPreviewProjectDto[]
> {
  return listManagedPortfolioPreviewProjects();
}

export async function listPublicPortfolioProjects(): Promise<PortfolioPreviewProjectItem[]> {
  return listPublicPortfolioPreviewProjects();
}

export async function createAdminPortfolioPreviewProject(
  input: CreateAdminPortfolioPreviewProjectInput,
): Promise<AdminPortfolioPreviewProjectDto> {
  const created = await createManagedPortfolioPreviewProject(input);

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'portfolio.manage',
    entityType: 'portfolio',
    entityId: created.slug,
    metadata: {
      adminEmail: input.adminEmail ?? null,
      operation: 'create',
      title: input.title,
      platforms: input.platforms.join(','),
      categories: input.categories.join(','),
    },
  });

  return created;
}

export async function deleteAdminPortfolioPreviewProject(
  input: DeleteAdminPortfolioPreviewProjectInput,
): Promise<{ projectId: string }> {
  await deleteManagedPortfolioPreviewProject({
    projectId: input.projectId,
  });

  await logAdminAction({
    adminUid: input.adminUid,
    actionType: 'portfolio.manage',
    entityType: 'portfolio',
    entityId: input.projectId,
    metadata: {
      adminEmail: input.adminEmail ?? null,
      operation: 'delete',
    },
  });

  return {
    projectId: input.projectId,
  };
}

export { countEffectivePortfolioItems };
