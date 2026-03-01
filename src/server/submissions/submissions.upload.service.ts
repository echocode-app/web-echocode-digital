import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_IMAGE_SIZE_BYTES,
  isDocumentMimeType,
  isImageMimeType,
} from '@/shared/validation/submissions';
import { resolveEventAttribution, trackEventBestEffort } from '@/server/analytics';
import { getFirebaseStorageBucket } from '@/server/firebase/storage';
import { validate } from '@/server/lib';
import { ApiError } from '@/server/lib/errors';

const TMP_UPLOAD_PREFIX = 'uploads/submissions/tmp/';
const UPLOAD_URL_TTL_MS = 10 * 60 * 1000;
const UUID_PATH_PATTERN = /^uploads\/submissions\/tmp\/[0-9a-f-]{36}$/;

const initUploadFileSchema = z.object({
  originalName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(128),
  sizeBytes: z.number().int().positive(),
});

export const projectUploadInitRequestSchema = z.object({
  formType: z.string().trim().min(1),
  file: initUploadFileSchema,
});

export type CreateProjectUploadInitParams = {
  rawBody: unknown;
  requestHeaders?: Headers;
};

export type CreateProjectUploadInitResponseDto = {
  uploadUrl: string;
  path: string;
  method: 'PUT';
  expiresAt: string;
  headers: {
    'Content-Type': string;
  };
};

export type VerifyUploadedProjectAttachmentInput = {
  path: string;
  mimeType: string;
  sizeBytes: number;
};

function isAllowedProjectAttachmentMime(mimeType: string): boolean {
  return isImageMimeType(mimeType) || isDocumentMimeType(mimeType);
}

function assertProjectAttachmentPolicy(input: {
  mimeType: string;
  sizeBytes: number;
}): void {
  if (input.sizeBytes <= 0) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Project attachment size must be greater than 0 bytes',
    );
  }

  if (!isAllowedProjectAttachmentMime(input.mimeType)) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      `Unsupported project attachment MIME type: ${input.mimeType}`,
    );
  }

  const maxSize = isImageMimeType(input.mimeType)
    ? MAX_IMAGE_SIZE_BYTES
    : MAX_DOCUMENT_SIZE_BYTES;

  if (input.sizeBytes > maxSize) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      `Project attachment exceeds allowed size for MIME type ${input.mimeType}`,
    );
  }
}

function assertTmpUploadPath(path: string): void {
  // Enforce strict tmp prefix to prevent cross-collection/path injection on submit.
  if (!path.startsWith(TMP_UPLOAD_PREFIX)) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Attachment path must use submissions tmp prefix',
    );
  }

  if (!UUID_PATH_PATTERN.test(path)) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Attachment path format is invalid',
    );
  }
}

function toIsoString(date: Date): string {
  return date.toISOString();
}

export async function createProjectUploadInit(
  params: CreateProjectUploadInitParams,
): Promise<CreateProjectUploadInitResponseDto> {
  const eventAttribution = resolveEventAttribution({
    rawBody: params.rawBody,
    headers: params.requestHeaders,
  });
  const parsed = validate(projectUploadInitRequestSchema, params.rawBody);

  if (parsed.formType !== 'project') {
    throw ApiError.fromCode(
      'NOT_IMPLEMENTED',
      'Only project form upload init is implemented',
    );
  }

  assertProjectAttachmentPolicy({
    mimeType: parsed.file.mimeType,
    sizeBytes: parsed.file.sizeBytes,
  });

  const bucket = getFirebaseStorageBucket();
  const path = `${TMP_UPLOAD_PREFIX}${randomUUID()}`;
  const expiresAtDate = new Date(Date.now() + UPLOAD_URL_TTL_MS);
  const file = bucket.file(path);

  let uploadUrl: string;
  try {
    // Content-Type is bound into the signed URL request so upload/submit metadata can be cross-checked.
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: expiresAtDate,
      contentType: parsed.file.mimeType,
    });
    uploadUrl = signedUrl;
  } catch (cause) {
    throw ApiError.fromCode(
      'FIREBASE_UNAVAILABLE',
      'Failed to generate signed upload URL',
      { cause },
    );
  }

  await trackEventBestEffort({
    eventType: 'submit_project',
    headers: params.requestHeaders,
    metadata: {
      stage: 'upload_init',
      mimeType: parsed.file.mimeType,
      ...(eventAttribution
        ? {
            attribution: {
              source: eventAttribution.source,
              medium: eventAttribution.medium ?? null,
              campaign: eventAttribution.campaign ?? null,
            },
          }
        : {}),
    },
  });

  return {
    uploadUrl,
    path,
    method: 'PUT',
    expiresAt: toIsoString(expiresAtDate),
    headers: {
      'Content-Type': parsed.file.mimeType,
    },
  };
}

type GcsFileMetadata = {
  contentType?: string | null;
  size?: string | number | null;
};

function normalizeMetadataSize(size: GcsFileMetadata['size']): number | null {
  if (typeof size === 'number' && Number.isInteger(size) && size >= 0) return size;
  if (typeof size !== 'string') return null;
  if (!/^\d+$/.test(size)) return null;

  const parsed = Number(size);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export async function verifyUploadedProjectAttachment(
  input: VerifyUploadedProjectAttachmentInput,
): Promise<void> {
  assertProjectAttachmentPolicy({
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  });
  assertTmpUploadPath(input.path);

  const bucket = getFirebaseStorageBucket();
  const file = bucket.file(input.path);

  let metadata: GcsFileMetadata;
  try {
    // Submit-time verification intentionally treats missing object as client error (invalid upload flow state).
    const [rawMetadata] = await file.getMetadata();
    metadata = rawMetadata;
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
      'Uploaded attachment MIME type does not match submitted metadata',
    );
  }

  const objectSize = normalizeMetadataSize(metadata.size);
  if (objectSize == null) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Uploaded attachment size metadata is invalid',
    );
  }

  if (objectSize <= 0) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Uploaded attachment size must be greater than 0 bytes',
    );
  }

  if (objectSize !== input.sizeBytes) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Uploaded attachment size does not match submitted metadata',
    );
  }
}

export const projectAttachmentUploadPolicy = {
  allowedImageMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
  allowedDocumentMimeTypes: ALLOWED_DOCUMENT_MIME_TYPES,
  tmpPrefix: TMP_UPLOAD_PREFIX,
  ttlMs: UPLOAD_URL_TTL_MS,
} as const;
