export type VacancyPublicationStatus = 'draft' | 'published' | 'archived';

export type VacancySubmissionContextSnapshot = {
  vacancyId: string; // iosdev

  vacancySlug?: string; // /career/[slug] - iosdev

  vacancyTitle?: string; // card title - iOS Developer

  level?: string; // Level - Trainee

  conditions?: string[]; // ["Engineering", "Remote"]

  employmentType?: string; // Hero sublabel - Full-time
};
