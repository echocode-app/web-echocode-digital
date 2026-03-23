import { z } from 'zod';
import { validate } from '@/server/lib';
import {
  ALLOWED_CLIENT_PROJECT_ATTACHMENT_EXTENSIONS,
  ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES,
  MAX_CLIENT_PROJECT_ATTACHMENT_SIZE_BYTES,
} from '@/shared/forms/clientProjectUpload.constants';
import type {
  ClientProjectCreateInput,
  ClientProjectUploadInitInput,
  ClientSubmissionCursor,
  ClientSubmissionListQueryInput,
  ClientSubmissionStatus,
} from '@/server/forms/client-project/clientProject.types';

const NAME_PATTERN = /^[\p{L}\p{M}' -]+$/u;
const EMAIL_MAX_LEN = 120;
const DESCRIPTION_MAX_LEN = 2000;
const SUSPICIOUS_EXTENSION_PATTERN = /(exe|dll|bat|cmd|com|msi|sh|php|pl|py|jar|apk|bin)$/i;
const ATTACHMENT_PATH_PATTERN = /^client-submissions\/[0-9a-zA-Z_-]+\/(image|attachment)$/;

export const clientSubmissionStatusSchema = z.enum([
  'new',
  'viewed',
  'processed',
  'rejected',
  'deferred',
]);

const personNameSchema = z
  .string()
  .trim()
  .min(2, 'Must contain at least 2 characters')
  .max(40, 'Must contain at most 40 characters')
  .regex(NAME_PATTERN, 'Only letters, spaces, apostrophes and hyphens are allowed');

const imageMetaSchema = z.object({
  path: z
    .string()
    .trim()
    .min(1)
    .max(512)
    .regex(ATTACHMENT_PATH_PATTERN, 'Invalid attachment path format'),
  originalName: z.string().trim().min(1).max(255),
  mimeType: z.enum(ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(MAX_CLIENT_PROJECT_ATTACHMENT_SIZE_BYTES),
});

const uploadFileSchema = z.object({
  originalName: z.string().trim().min(1).max(255),
  mimeType: z.enum(ALLOWED_CLIENT_PROJECT_ATTACHMENT_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(MAX_CLIENT_PROJECT_ATTACHMENT_SIZE_BYTES),
});

export const clientProjectCreateSchema = z.object({
  firstName: personNameSchema,
  lastName: personNameSchema,
  email: z.string().trim().email('Must be a valid email').max(EMAIL_MAX_LEN, 'Email is too long'),
  description: z.string().trim().max(DESCRIPTION_MAX_LEN, 'Description is too long').optional(),
  image: imageMetaSchema.optional(),
});

export const clientProjectUploadInitSchema = z.object({
  file: uploadFileSchema,
});

export const clientSubmissionListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(20),
  cursor: z.string().trim().min(1).optional(),
  status: clientSubmissionStatusSchema.optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
});

export const updateClientSubmissionStatusSchema = z.object({
  status: clientSubmissionStatusSchema,
});

export const addClientSubmissionCommentSchema = z.object({
  comment: z.string().trim().min(1).max(1200),
});

export const clientSubmissionIdQuerySchema = z.object({
  submissionId: z.string().trim().min(1),
});

export type ClientSubmissionStatusSchema = ClientSubmissionStatus;

function getSafeExtension(name: string): string {
  const segments = name.toLowerCase().split('.').filter(Boolean);
  return segments[segments.length - 1] ?? '';
}

export function assertSafeAttachmentName(originalName: string): void {
  const fileName = originalName.trim().toLowerCase();
  const extension = getSafeExtension(fileName);

  if (
    !ALLOWED_CLIENT_PROJECT_ATTACHMENT_EXTENSIONS.includes(
      extension as (typeof ALLOWED_CLIENT_PROJECT_ATTACHMENT_EXTENSIONS)[number],
    )
  ) {
    throw new Error('Unsupported attachment extension');
  }

  const parts = fileName.split('.').filter(Boolean);
  const trailingParts = parts.slice(1);
  if (trailingParts.some((part) => SUSPICIOUS_EXTENSION_PATTERN.test(part))) {
    throw new Error('Suspicious extension sequence');
  }
}

export const assertSafeImageName = assertSafeAttachmentName;

export function parseClientProjectCreatePayload(input: unknown): ClientProjectCreateInput {
  return validate(clientProjectCreateSchema, input);
}

export function parseClientProjectUploadInitPayload(input: unknown): ClientProjectUploadInitInput {
  return validate(clientProjectUploadInitSchema, input);
}

export function parseClientSubmissionListQuery(input: unknown): ClientSubmissionListQueryInput {
  return validate(clientSubmissionListQuerySchema, input);
}

export function decodeClientSubmissionCursor(raw: string): ClientSubmissionCursor {
  const json = Buffer.from(raw, 'base64').toString('utf8');
  const parsed = JSON.parse(json) as { createdAtMs?: unknown; id?: unknown };

  if (
    !Number.isSafeInteger(parsed.createdAtMs) ||
    typeof parsed.id !== 'string' ||
    parsed.id.trim().length === 0
  ) {
    throw new Error('Invalid cursor');
  }

  return {
    createdAtMs: parsed.createdAtMs as number,
    id: parsed.id,
  };
}

export function encodeClientSubmissionCursor(cursor: ClientSubmissionCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64');
}
