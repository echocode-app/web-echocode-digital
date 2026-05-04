import type { ModerationActorProfileDto } from '@/server/forms/shared/moderation.types';

export type VacancyPublicationStatus = 'draft' | 'published' | 'archived';

export type VacancyLevel =
  | 'Intern'
  | 'Trainee'
  | 'Junior'
  | 'Middle'
  | 'Senior'
  | 'Lead'
  | 'Principal'
  | 'Head';

export type ManagedVacancyId = 'iosdev' | 'qaengineer' | 'designer';

export type VacancySubmissionContextSnapshot = {
  vacancyId: string; // iosdev

  vacancySlug?: string; // /career/[slug] - iosdev

  vacancyTitle?: string; // card title - iOS Developer

  level?: string | null; // Level - Trainee

  conditions?: string[]; // ["Engineering", "Remote"]

  employmentType?: string; // Hero sublabel - Full-time
};

export type ManagedVacancyDefinition = {
  vacancyId: ManagedVacancyId;
  vacancySlug: string;
  vacancyTitle: string;
  defaultLevel: VacancyLevel | null;
  defaultHotPosition: boolean;
  defaultPublished: boolean;
  conditions: string[];
  employmentType: string;
  location: string;
  sortOrder: number;
};

export type ManagedVacancyRecord = {
  vacancyId: ManagedVacancyId;
  vacancySlug: string;
  vacancyTitle: string;
  conditions: string[];
  employmentType: string;
  location: string;
  level: VacancyLevel | null;
  hotPosition: boolean;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string | null;
  createdAt: string | null;
  updatedBy: string | null;
  updatedByProfile: ModerationActorProfileDto | null;
  hasStoredConfig: boolean;
};

export type PublicVacancyListItem = VacancySubmissionContextSnapshot & {
  vacancyId: ManagedVacancyId;
  vacancySlug: string;
  vacancyTitle: string;
  conditions: string[];
  employmentType: string;
  level: VacancyLevel | null;
  hotPosition: boolean;
  datePosted: string | null;
};

export type AdminVacancyListItemDto = ManagedVacancyRecord & {
  availableLevels: readonly VacancyLevel[];
};

export type UpdateAdminVacancyInput = {
  vacancyId: ManagedVacancyId;
  isPublished?: boolean;
  hotPosition?: boolean;
  level?: VacancyLevel | null;
  adminUid: string;
  adminEmail?: string | null;
};
