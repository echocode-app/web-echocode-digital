import type { ModerationCommentDto } from '@/server/forms/shared/moderation.types';
import type { VacancySubmissionStatus } from '@/server/forms/vacancy-submission/vacancySubmission.types';
import {
  getAdminIdTokenOrThrow,
  parseAdminApiError,
  withAuthHeaders,
} from '@/components/admin/moderation/shared/adminModeration.api';
import type {
  VacancyCandidateDetailsDto,
  VacancyCandidatesListResponseDto,
} from './vacancyCandidates.types';

const BASE_PATH = '/api/admin/vacancies/candidates';

export async function fetchVacancyCandidatesList(
  query: string,
  signal?: AbortSignal,
): Promise<VacancyCandidatesListResponseDto> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(`${BASE_PATH}?${query}`, {
    method: 'GET',
    headers: withAuthHeaders(token),
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await parseAdminApiError(
        response,
        'Failed to load candidate submissions. Please refresh the page.',
      ),
    );
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: VacancyCandidatesListResponseDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid vacancy candidates payload');
  }

  return payload.data;
}

export async function updateVacancyCandidateStatus(input: {
  submissionId: string;
  status: VacancySubmissionStatus;
}): Promise<void> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(
    `${BASE_PATH}/status?submissionId=${encodeURIComponent(input.submissionId)}`,
    {
      method: 'PATCH',
      headers: {
        ...withAuthHeaders(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: input.status }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseAdminApiError(response, 'Status update failed. Please try again.'));
  }
}

export async function fetchVacancyCandidateDetails(
  submissionId: string,
  signal?: AbortSignal,
): Promise<VacancyCandidateDetailsDto> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(`${BASE_PATH}/${encodeURIComponent(submissionId)}`, {
    method: 'GET',
    headers: withAuthHeaders(token),
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await parseAdminApiError(response, 'Failed to load details. Try refreshing the page.'),
    );
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: VacancyCandidateDetailsDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid vacancy candidate payload');
  }

  return payload.data;
}

export async function addVacancyCandidateComment(input: {
  submissionId: string;
  comment: string;
}): Promise<ModerationCommentDto> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(
    `${BASE_PATH}/comment?submissionId=${encodeURIComponent(input.submissionId)}`,
    {
      method: 'POST',
      headers: {
        ...withAuthHeaders(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: input.comment }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseAdminApiError(response, 'Comment add failed. Please try again.'));
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: {
      comment: ModerationCommentDto;
    };
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid comment payload');
  }

  return payload.data.comment;
}

export async function softDeleteVacancyCandidate(input: { submissionId: string }): Promise<void> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(
    `${BASE_PATH}/delete?submissionId=${encodeURIComponent(input.submissionId)}`,
    {
      method: 'DELETE',
      headers: withAuthHeaders(token),
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseAdminApiError(response, 'Unable to delete submission. Please try again.'),
    );
  }
}
