import type {
  AdminAccessEntryDto,
  AdminAccessListDto,
  CreateAdminAccessInput,
  UpdateAdminAccessInput,
} from '@/server/admin';
import {
  getAdminIdTokenOrThrow,
  parseAdminApiError,
  withAuthHeaders,
} from '@/components/admin/moderation/shared/adminModeration.api';

type ApiPayload<T> = {
  success: boolean;
  data?: T;
};

const BASE_PATH = '/api/admin/access';
const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

async function requestAdminAccess(input: {
  path?: string;
  method: 'GET' | 'POST' | 'PATCH';
  body?: Record<string, unknown>;
  signal?: AbortSignal;
  fallbackError: string;
}): Promise<Response> {
  const token = await getAdminIdTokenOrThrow();

  return fetch(`${BASE_PATH}${input.path ?? ''}`, {
    method: input.method,
    headers: input.body
      ? {
          ...withAuthHeaders(token),
          ...JSON_HEADERS,
        }
      : withAuthHeaders(token),
    body: input.body ? JSON.stringify(input.body) : undefined,
    cache: 'no-store',
    signal: input.signal,
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(await parseAdminApiError(response, input.fallbackError));
    }

    return response;
  });
}

async function parseApiPayload<TData>(
  response: Response,
  invalidPayloadError: string,
): Promise<TData> {
  const payload = (await response.json()) as ApiPayload<TData>;

  if (!payload.success || !payload.data) {
    throw new Error(invalidPayloadError);
  }

  return payload.data;
}

export async function fetchAdminAccessList(signal: AbortSignal): Promise<AdminAccessListDto> {
  const response = await requestAdminAccess({
    method: 'GET',
    signal,
    fallbackError: 'Failed to load admin access registry.',
  });

  return parseApiPayload(response, 'Admin access payload is invalid.');
}

export async function createAdminAccessEntry(
  input: CreateAdminAccessInput,
): Promise<AdminAccessEntryDto> {
  const response = await requestAdminAccess({
    method: 'POST',
    body: input,
    fallbackError: 'Failed to save new admin access entry.',
  });

  return parseApiPayload(response, 'Admin access create payload is invalid.');
}

export async function updateAdminAccessEntry(
  normalizedEmail: string,
  input: UpdateAdminAccessInput,
): Promise<AdminAccessEntryDto> {
  const response = await requestAdminAccess({
    path: `/${encodeURIComponent(normalizedEmail)}`,
    method: 'PATCH',
    body: input,
    fallbackError: 'Failed to update admin access entry.',
  });

  return parseApiPayload(response, 'Admin access update payload is invalid.');
}
