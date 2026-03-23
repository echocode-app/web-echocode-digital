import type { AdminVacancyListItemDto, VacancyLevel } from '@/server/vacancies';
import {
  getAdminIdTokenOrThrow,
  parseAdminApiError,
  withAuthHeaders,
} from '@/components/admin/moderation/shared/adminModeration.api';

type ApiPayload<T> = {
  success: boolean;
  data?: T;
};

export async function fetchAdminVacancies(signal: AbortSignal): Promise<AdminVacancyListItemDto[]> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch('/api/admin/vacancies', {
    method: 'GET',
    headers: withAuthHeaders(token),
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(await parseAdminApiError(response, 'Failed to load vacancies settings.'));
  }

  const payload = (await response.json()) as ApiPayload<AdminVacancyListItemDto[]>;

  if (!payload.success || !payload.data) {
    throw new Error('Vacancies settings payload is invalid.');
  }

  return payload.data;
}

export async function updateAdminVacancyRequest(input: {
  vacancyId: string;
  isPublished: boolean;
  hotPosition: boolean;
  level: VacancyLevel | null;
}): Promise<AdminVacancyListItemDto> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(`/api/admin/vacancies/${encodeURIComponent(input.vacancyId)}`, {
    method: 'PATCH',
    headers: {
      ...withAuthHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isPublished: input.isPublished,
      hotPosition: input.hotPosition,
      level: input.level,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseAdminApiError(response, 'Failed to update vacancy settings.'));
  }

  const payload = (await response.json()) as ApiPayload<AdminVacancyListItemDto>;

  if (!payload.success || !payload.data) {
    throw new Error('Vacancy update payload is invalid.');
  }

  return payload.data;
}
