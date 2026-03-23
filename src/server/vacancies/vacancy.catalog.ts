import type { ManagedVacancyDefinition, ManagedVacancyId } from '@/server/vacancies/vacancy.types';

export const PREDEFINED_VACANCIES: readonly ManagedVacancyDefinition[] = [
  {
    vacancyId: 'iosdev',
    vacancySlug: 'iosdev',
    vacancyTitle: 'iOS Developer',
    defaultLevel: 'Trainee',
    defaultHotPosition: true,
    defaultPublished: true,
    conditions: ['Engineering', 'Remote'],
    employmentType: 'Remote ／ Full-time',
    location: 'Remote',
    sortOrder: 0,
  },
  {
    vacancyId: 'qaengineer',
    vacancySlug: 'qaengineer',
    vacancyTitle: 'QA Engineer',
    defaultLevel: 'Middle',
    defaultHotPosition: false,
    defaultPublished: true,
    conditions: ['Quality Assurance', 'Remote'],
    employmentType: 'Remote ／ Full-time',
    location: 'Remote',
    sortOrder: 1,
  },
  {
    vacancyId: 'designer',
    vacancySlug: 'designer',
    vacancyTitle: 'UI／UX Designer',
    defaultLevel: null,
    defaultHotPosition: false,
    defaultPublished: true,
    conditions: ['Design', 'Remote'],
    employmentType: 'Remote ／ Full-time',
    location: 'Remote',
    sortOrder: 2,
  },
] as const;

export const PREDEFINED_VACANCY_ID_SET = new Set<ManagedVacancyId>(
  PREDEFINED_VACANCIES.map((item) => item.vacancyId),
);

export function getPredefinedVacancyById(vacancyId: ManagedVacancyId): ManagedVacancyDefinition {
  const definition = PREDEFINED_VACANCIES.find((item) => item.vacancyId === vacancyId);

  if (!definition) {
    throw new Error(`Unknown predefined vacancy: ${vacancyId}`);
  }

  return definition;
}

export function getPredefinedVacancyBySlug(slug: string): ManagedVacancyDefinition | null {
  const normalized = slug.trim().toLowerCase();

  return (
    PREDEFINED_VACANCIES.find(
      (item) => item.vacancySlug === normalized || item.vacancyId === normalized,
    ) ?? null
  );
}
