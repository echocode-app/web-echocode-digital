import type { VacancyPublicationStatus } from '@/server/vacancies/vacancy.types';

export const VACANCY_PUBLICATION_STATUS_VALUES: readonly VacancyPublicationStatus[] = [
  'draft', // hidden
  'published', // visible
  'archived', // history only
] as const;

export const VACANCY_ANALYTICS_ID_KEYS = [
  'vacancyId', // canonical id
  'vacancySlug', // route slug
  'vacancy', // legacy id
  'jobId', // legacy id
  'jobSlug', // legacy slug
  'slug', // generic slug
  'positionId', // legacy position id
] as const;

export const VACANCY_ANALYTICS_LABEL_KEYS = [
  'vacancyTitle', // canonical title
  'jobTitle', // legacy title
  'title', // generic title
  'position', // position title
] as const;
