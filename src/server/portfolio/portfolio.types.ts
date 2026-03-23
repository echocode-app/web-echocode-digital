import type { ModerationActorProfileDto } from '@/server/forms/shared/moderation.types';
import type {
  PORTFOLIO_CATEGORY_VALUES,
  PORTFOLIO_PLATFORM_VALUES,
} from '@/shared/portfolio/portfolio.constants';
import type { UploadedFileInput } from '@/shared/validation/submissions.files';

export type PortfolioPlatform = (typeof PORTFOLIO_PLATFORM_VALUES)[number];
export type PortfolioCategory = (typeof PORTFOLIO_CATEGORY_VALUES)[number];

export type PortfolioPreviewProjectItem = {
  image: string;
  title: string;
  platforms: PortfolioPlatform[];
  id: string;
  categories: PortfolioCategory[];
};

export type ManagedPortfolioPreviewProjectRecord = PortfolioPreviewProjectItem & {
  slug: string;
  imagePath: string | null;
  isPublished: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  updatedByProfile: ModerationActorProfileDto | null;
};

export type AdminPortfolioPreviewProjectDto = ManagedPortfolioPreviewProjectRecord;

export type CreateAdminPortfolioPreviewProjectInput = {
  title: string;
  platforms: PortfolioPlatform[];
  categories: PortfolioCategory[];
  image: UploadedFileInput;
  adminUid: string;
  adminEmail?: string | null;
};

export type DeleteAdminPortfolioPreviewProjectInput = {
  projectId: string;
  adminUid: string;
  adminEmail?: string | null;
};
