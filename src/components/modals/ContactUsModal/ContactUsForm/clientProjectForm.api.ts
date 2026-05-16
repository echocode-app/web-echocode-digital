import { normalize } from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.validation';
import {
  getClientAnalyticsContextPayload,
  getClientAnalyticsHeaders,
} from '@/components/analytics/clientAnalytics';
import type {
  FormValues,
  UploadedImagePayload,
} from '@/components/modals/ContactUsModal/ContactUsForm/clientProjectForm.types';

type UploadInitPayload = {
  success: boolean;
  data?: {
    uploadUrl: string;
    path: string;
    method: 'PUT';
    headers: {
      'Content-Type': string;
    };
  };
};

type CreateSubmissionPayload = { success: boolean };
export type ClientProjectSubmitSource = 'client_project_modal' | 'client_project_footer';
type ErrorPayload = {
  error?: {
    message?: string;
  };
};

async function getApiErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as ErrorPayload;
    const message = payload.error?.message?.trim();
    if (message) return message;
  } catch {
    // Ignore JSON parsing and keep fallback.
  }

  return fallback;
}

export async function initAttachmentUpload(file: File): Promise<UploadedImagePayload> {
  const analyticsContext = getClientAnalyticsContextPayload();
  const initResponse = await fetch('/api/forms/client-project/image/init', {
    method: 'POST',
    headers: getClientAnalyticsHeaders(),
    body: JSON.stringify({
      file: {
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      },
      ...analyticsContext,
    }),
  });

  if (!initResponse.ok) {
    if (initResponse.status === 503) {
      throw new Error(
        'File upload is temporarily unavailable. Please submit the form without a file.',
      );
    }
    throw new Error(await getApiErrorMessage(initResponse, 'Failed to initialize file upload'));
  }

  const initPayload = (await initResponse.json()) as UploadInitPayload;
  if (!initPayload.success || !initPayload.data) {
    throw new Error('Invalid file upload initialization payload');
  }

  const uploadResult = await fetch(initPayload.data.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': initPayload.data.headers['Content-Type'],
    },
    body: file,
  });

  if (!uploadResult.ok) {
    throw new Error('Failed to upload file');
  }

  return {
    path: initPayload.data.path,
    originalName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

export async function submitClientProject(
  values: FormValues,
  imagePayload: UploadedImagePayload | undefined,
  turnstileToken: string,
  source: ClientProjectSubmitSource = 'client_project_modal',
): Promise<{ ok: boolean; status: number }> {
  const normalized = normalize(values);
  const analyticsContext = getClientAnalyticsContextPayload();

  const response = await fetch('/api/forms/client-project', {
    method: 'POST',
    headers: getClientAnalyticsHeaders(),
    body: JSON.stringify({
      firstName: normalized.firstName,
      countryCode: normalized.countryCode,
      turnstileToken,
      phone: normalized.phone,
      email: normalized.email,
      source,
      ...(normalized.description ? { description: normalized.description } : {}),
      ...(imagePayload ? { image: imagePayload } : {}),
      ...analyticsContext,
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  const payload = (await response.json()) as CreateSubmissionPayload;
  return { ok: Boolean(payload.success), status: response.status };
}
