import type { ModerationCommentDto } from '@/server/forms/shared/moderation.types';
import type { EmailSubmissionStatus } from '@/server/forms/email-submission/emailSubmission.types';
import {
  getAdminIdTokenOrThrow,
  parseAdminApiError,
  withAuthHeaders,
} from '@/components/admin/moderation/shared/adminModeration.api';
import type {
  EmailSubmissionDetailsDto,
  EmailSubmissionsListResponseDto,
} from './emailSubmissions.types';

export async function fetchEmailSubmissionsList(
  query: string,
  signal?: AbortSignal,
): Promise<EmailSubmissionsListResponseDto> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(`/api/admin/submissions/emails?${query}`, {
    method: 'GET',
    headers: withAuthHeaders(token),
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await parseAdminApiError(
        response,
        'Failed to load email submissions. Please refresh the page.',
      ),
    );
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: EmailSubmissionsListResponseDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid email submissions payload');
  }

  return payload.data;
}

export async function updateEmailSubmissionStatus(input: {
  submissionId: string;
  status: EmailSubmissionStatus;
}): Promise<void> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(
    `/api/admin/submissions/emails/status?submissionId=${encodeURIComponent(input.submissionId)}`,
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

export async function fetchEmailSubmissionDetails(
  submissionId: string,
  signal?: AbortSignal,
): Promise<EmailSubmissionDetailsDto> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(
    `/api/admin/submissions/emails/${encodeURIComponent(submissionId)}`,
    {
      method: 'GET',
      headers: withAuthHeaders(token),
      cache: 'no-store',
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseAdminApiError(response, 'Failed to load details. Try refreshing the page.'),
    );
  }

  const payload = (await response.json()) as {
    success: boolean;
    data?: EmailSubmissionDetailsDto;
  };

  if (!payload.success || !payload.data) {
    throw new Error('Invalid email submission payload');
  }

  return payload.data;
}

export async function addEmailSubmissionComment(input: {
  submissionId: string;
  comment: string;
}): Promise<ModerationCommentDto> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(
    `/api/admin/submissions/emails/comment?submissionId=${encodeURIComponent(input.submissionId)}`,
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

export async function softDeleteEmailSubmission(input: { submissionId: string }): Promise<void> {
  const token = await getAdminIdTokenOrThrow();
  const response = await fetch(
    `/api/admin/submissions/emails/delete?submissionId=${encodeURIComponent(input.submissionId)}`,
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
