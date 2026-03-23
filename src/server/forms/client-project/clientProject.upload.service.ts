import { randomUUID } from 'node:crypto';
import { getFirebaseStorageBucket } from '@/server/firebase/storage';
import { ApiError } from '@/server/lib/errors';
import {
  assertSafeAttachmentName,
  parseClientProjectUploadInitPayload,
} from '@/server/forms/client-project/clientProject.validation';
import {
  ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES,
  MAX_CLIENT_PROJECT_ATTACHMENT_SIZE_BYTES,
} from '@/shared/forms/clientProjectUpload.constants';
import type {
  ClientProjectImageMetaInput,
  ClientProjectUploadInitResponseDto,
} from '@/server/forms/client-project/clientProject.types';

const UPLOAD_URL_TTL_MS = 10 * 60 * 1000;

function isAllowedAttachmentMimeType(mimeType: string): boolean {
  return ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES.includes(
    mimeType as (typeof ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES)[number],
  );
}

function assertAttachmentPolicy(input: {
  mimeType: string;
  sizeBytes: number;
  originalName: string;
}): void {
  if (!isAllowedAttachmentMimeType(input.mimeType)) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      `Unsupported attachment MIME type: ${input.mimeType}`,
    );
  }

  if (input.sizeBytes <= 0 || input.sizeBytes > MAX_CLIENT_PROJECT_ATTACHMENT_SIZE_BYTES) {
    throw ApiError.fromCode('ATTACHMENT_VERIFICATION_FAILED', 'Attachment exceeds allowed size');
  }

  try {
    assertSafeAttachmentName(input.originalName);
  } catch {
    throw ApiError.fromCode('ATTACHMENT_VERIFICATION_FAILED', 'Attachment filename is suspicious');
  }
}

function toReadSignedUrlExpiry(): Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

async function getSignedReadUrl(path: string): Promise<string> {
  const bucket = getFirebaseStorageBucket();
  const file = bucket.file(path);

  try {
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: toReadSignedUrlExpiry(),
    });

    return url;
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to generate image access URL', {
      cause,
    });
  }
}

async function verifyUploadedImageMeta(input: ClientProjectImageMetaInput): Promise<void> {
  assertAttachmentPolicy(input);

  const bucket = getFirebaseStorageBucket();
  const file = bucket.file(input.path);

  let metadata: { contentType?: string | null; size?: string | number | null };
  try {
    const [raw] = await file.getMetadata();
    metadata = raw;
  } catch (cause) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Uploaded attachment object was not found',
      { cause },
    );
  }

  if (metadata.contentType !== input.mimeType) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Uploaded attachment MIME type mismatch',
    );
  }

  const sizeRaw = metadata.size;
  const parsedSize =
    typeof sizeRaw === 'number'
      ? sizeRaw
      : typeof sizeRaw === 'string' && /^\d+$/.test(sizeRaw)
        ? Number(sizeRaw)
        : null;

  if (parsedSize === null || !Number.isSafeInteger(parsedSize) || parsedSize <= 0) {
    throw ApiError.fromCode('ATTACHMENT_VERIFICATION_FAILED', 'Uploaded attachment size mismatch');
  }

  if (parsedSize !== input.sizeBytes) {
    throw ApiError.fromCode('ATTACHMENT_VERIFICATION_FAILED', 'Uploaded attachment size mismatch');
  }
}

export async function resolveClientSubmissionImageUrl(
  imageMeta: ClientProjectImageMetaInput | undefined,
): Promise<string | null> {
  if (!imageMeta) {
    return null;
  }

  await verifyUploadedImageMeta(imageMeta);
  return getSignedReadUrl(imageMeta.path);
}

export async function createClientProjectUploadInit(input: {
  rawBody: unknown;
}): Promise<ClientProjectUploadInitResponseDto> {
  const parsed = parseClientProjectUploadInitPayload(input.rawBody);
  const file = parsed.file;

  assertAttachmentPolicy(file);

  const submissionId = randomUUID();
  const path = `client-submissions/${submissionId}/attachment`;
  const expiresAt = new Date(Date.now() + UPLOAD_URL_TTL_MS);

  const bucket = getFirebaseStorageBucket();
  const object = bucket.file(path);

  let uploadUrl: string;
  try {
    const [signedUrl] = await object.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: expiresAt,
      contentType: file.mimeType,
    });

    uploadUrl = signedUrl;
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to generate upload URL', { cause });
  }

  return {
    uploadUrl,
    path,
    method: 'PUT',
    expiresAt: expiresAt.toISOString(),
    headers: {
      'Content-Type': file.mimeType,
    },
  };
}
