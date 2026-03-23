import { MODERATION_STATUSES } from '@/server/forms/shared/moderation.types';
import type { VacancySubmissionContextSnapshot } from '@/server/vacancies';

export const VACANCY_SUBMISSIONS_COLLECTION = 'vacancy_submissions';
export const VACANCY_SUBMISSION_STATUS_ORDER = MODERATION_STATUSES;

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
  return normalized.length > 0 ? normalized : undefined;
}

export function toVacancyKey(snapshot: VacancySubmissionContextSnapshot): string {
  // Prefer immutable id key, then slug; this keeps grouping stable across title edits.
  const id = normalizeString(snapshot.vacancyId);
  if (id) return `id:${id}`;

  const slug = normalizeString(snapshot.vacancySlug);
  if (slug) return `slug:${slug}`;

  return 'unknown';
}

export function mapVacancySnapshot(data: Record<string, unknown>): VacancySubmissionContextSnapshot {
  const rawVacancy = data.vacancy;
  if (!rawVacancy || typeof rawVacancy !== 'object' || Array.isArray(rawVacancy)) {
    const fallbackId = normalizeString(data.vacancyId) ?? 'unknown';
    return {
      vacancyId: fallbackId,
      vacancySlug: normalizeString(data.vacancySlug),
      vacancyTitle: normalizeString(data.vacancyTitle),
      level: normalizeString(data.vacancyLevel),
      employmentType: normalizeString(data.vacancyEmploymentType),
      conditions: normalizeStringArray(data.vacancyConditions),
    };
  }

  const vacancy = rawVacancy as Record<string, unknown>;
  return {
    vacancyId: normalizeString(vacancy.vacancyId) ?? 'unknown',
    vacancySlug: normalizeString(vacancy.vacancySlug),
    vacancyTitle: normalizeString(vacancy.vacancyTitle),
    level: normalizeString(vacancy.level),
    employmentType: normalizeString(vacancy.employmentType),
    conditions: normalizeStringArray(vacancy.conditions),
  };
}
