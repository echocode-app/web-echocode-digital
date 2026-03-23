import type { AdminPortfolioPreviewProjectDto } from '@/server/portfolio';
import {
  getAdminIdTokenOrThrow,
  parseAdminApiError,
  withAuthHeaders,
} from '@/components/admin/moderation/shared/adminModeration.api';

type ApiPayload<T> = {
  success: boolean;
  data?: T;
};

const BASE_PATH = '/api/admin/portfolio';
const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

async function requestAdminPortfolio(input: {
  path?: string;
  method: 'GET' | 'POST' | 'DELETE';
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

export async function fetchAdminPortfolioProjects(
  signal: AbortSignal,
): Promise<AdminPortfolioPreviewProjectDto[]> {
  const response = await requestAdminPortfolio({
    method: 'GET',
    signal,
    fallbackError: 'Failed to load portfolio preview cards.',
  });

  return parseApiPayload(response, 'Portfolio preview cards payload is invalid.');
}

export async function createAdminPortfolioProject(input: {
  title: string;
  platforms: string[];
  categories: string[];
  image: {
    path: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
  };
}): Promise<AdminPortfolioPreviewProjectDto> {
  const response = await requestAdminPortfolio({
    method: 'POST',
    body: input,
    fallbackError: 'Failed to create portfolio preview card.',
  });

  return parseApiPayload(response, 'Portfolio create payload is invalid.');
}

export async function initAdminPortfolioImageUpload(file: File): Promise<{
  path: string;
  uploadUrl: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}> {
  const response = await requestAdminPortfolio({
    path: '/image/init',
    method: 'POST',
    body: {
      file: {
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      },
    },
    fallbackError: 'Failed to initialize portfolio image upload.',
  });

  const payload = await parseApiPayload<{
    path: string;
    uploadUrl: string;
  }>(response, 'Portfolio image upload init payload is invalid.');

  return {
    path: payload.path,
    uploadUrl: payload.uploadUrl,
    originalName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

export async function uploadAdminPortfolioImage(file: File, uploadUrl: string): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload portfolio image.');
  }
}

export async function deleteAdminPortfolioProject(projectId: string): Promise<void> {
  await requestAdminPortfolio({
    path: `/${encodeURIComponent(projectId)}`,
    method: 'DELETE',
    fallbackError: 'Failed to delete portfolio preview card.',
  });
}
