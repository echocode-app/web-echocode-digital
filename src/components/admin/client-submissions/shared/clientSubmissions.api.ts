import type { ClientSubmissionCommentDto, ClientSubmissionStatus } from '@/server/forms/client-project/clientProject.types';
import { getFirebaseClientAuth } from '@/lib/firebase/client';
import type {
  ClientSubmissionDetailsDto,
  ClientSubmissionsListResponseDto,
} from './clientSubmissions.types';

function withAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getTokenOrThrow(): Promise<string> {
  const auth = getFirebaseClientAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user.getIdToken(true);
}

export async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: { message?: string } };
    const message = payload.error?.message?.trim();
    if (message) return message;
  } catch {
    // noop
  }

  return fallback;
}

export async function fetchClientSubmissionsList(query: string, signal?: AbortSignal): Promise<ClientSubmissionsListResponseDto> {
  const token = await getTokenOrThrow();
  const response = await fetch(`/api/admin/submissions/clients?${query}`, {
    method: 'GET',
    headers: withAuthHeaders(token),
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Failed to load client submissions. Please refresh the page.'));
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: ClientSubmissionsListResponseDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid client submissions payload');
  }

  return payload.data;
}

export async function updateClientSubmissionStatus(input: {
  submissionId: string;
  status: ClientSubmissionStatus;
}): Promise<void> {
  const token = await getTokenOrThrow();
  const response = await fetch(`/api/admin/submissions/clients/status?submissionId=${encodeURIComponent(input.submissionId)}`, {
    method: 'PATCH',
    headers: {
      ...withAuthHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: input.status }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Status update failed. Please try again.'));
  }
}

export async function fetchClientSubmissionDetails(submissionId: string, signal?: AbortSignal): Promise<ClientSubmissionDetailsDto> {
  const token = await getTokenOrThrow();
  const response = await fetch(`/api/admin/submissions/clients/${encodeURIComponent(submissionId)}`, {
    method: 'GET',
    headers: withAuthHeaders(token),
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Failed to load details. Try refreshing the page.'));
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: ClientSubmissionDetailsDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid payload');
  }

  return payload.data;
}

export async function addClientSubmissionComment(input: {
  submissionId: string;
  comment: string;
}): Promise<ClientSubmissionCommentDto> {
  const token = await getTokenOrThrow();
  const response = await fetch(`/api/admin/submissions/clients/comment?submissionId=${encodeURIComponent(input.submissionId)}`, {
    method: 'POST',
    headers: {
      ...withAuthHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment: input.comment }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Comment add failed. Please try again.'));
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: {
      comment: ClientSubmissionCommentDto;
    };
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid comment payload');
  }

  return payload.data.comment;
}

export async function softDeleteClientSubmission(input: {
  submissionId: string;
}): Promise<void> {
  const token = await getTokenOrThrow();
  const response = await fetch(`/api/admin/submissions/clients/delete?submissionId=${encodeURIComponent(input.submissionId)}`, {
    method: 'DELETE',
    headers: withAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Unable to delete submission. Please try again.'));
  }
}
