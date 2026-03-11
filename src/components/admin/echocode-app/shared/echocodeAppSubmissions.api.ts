import type { SubmissionListStatus } from '@/server/submissions/submissions.types';
import type {
  EchocodeAppSubmissionDetailsDto,
  EchocodeAppSubmissionsDto,
} from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.types';
import {
  getTokenOrThrow,
  parseErrorMessage,
} from '@/components/admin/client-submissions/shared/clientSubmissions.api';

export async function fetchEchocodeAppSubmissionsList(
  query: string,
  signal?: AbortSignal,
): Promise<EchocodeAppSubmissionsDto> {
  const token = await getTokenOrThrow();
  const response = await fetch(`/api/admin/echocode-app/submissions?${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(
        response,
        'Failed to load echocode.app submissions. Please refresh the page.',
      ),
    );
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: EchocodeAppSubmissionsDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid echocode.app submissions payload');
  }

  return payload.data;
}

export async function updateEchocodeAppSubmissionStatus(input: {
  submissionId: string;
  status: SubmissionListStatus;
}): Promise<void> {
  const token = await getTokenOrThrow();
  const response = await fetch(
    `/api/admin/echocode-app/submissions/status?submissionId=${encodeURIComponent(input.submissionId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: input.status }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Status update failed. Please try again.'));
  }
}

export async function fetchEchocodeAppSubmissionDetails(
  submissionId: string,
  signal?: AbortSignal,
): Promise<EchocodeAppSubmissionDetailsDto> {
  const token = await getTokenOrThrow();
  const response = await fetch(
    `/api/admin/echocode-app/submissions/${encodeURIComponent(submissionId)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, 'Failed to load details. Try refreshing the page.'),
    );
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: EchocodeAppSubmissionDetailsDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid echocode.app submission details payload');
  }

  return payload.data;
}

export async function addEchocodeAppSubmissionComment(input: {
  submissionId: string;
  comment: string;
}) {
  const token = await getTokenOrThrow();
  const response = await fetch(
    `/api/admin/echocode-app/submissions/comment?submissionId=${encodeURIComponent(input.submissionId)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: input.comment }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Comment add failed. Please try again.'));
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: {
      comment: EchocodeAppSubmissionDetailsDto['item']['comments'][number];
    };
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid echocode.app comment payload');
  }

  return payload.data.comment;
}

export async function softDeleteEchocodeAppSubmission(input: {
  submissionId: string;
}): Promise<void> {
  const token = await getTokenOrThrow();
  const response = await fetch(
    `/api/admin/echocode-app/submissions/delete?submissionId=${encodeURIComponent(input.submissionId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, 'Unable to delete submission. Please try again.'),
    );
  }
}
