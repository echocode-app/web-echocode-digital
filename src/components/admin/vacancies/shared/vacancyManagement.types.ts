import type { VacancyLevel } from '@/server/vacancies';

export type VacancyCardState = {
  isPublished: boolean;
  hotPosition: boolean;
  level: VacancyLevel | null;
};

export type VacancyManagementLoadState = 'loading' | 'ready' | 'error';
