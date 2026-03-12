import { z } from 'zod';
import { ALLOWED_DOCUMENT_MIME_TYPES, MAX_DOCUMENT_SIZE_BYTES } from '@/shared/validation';

const HTTP_URL_PATTERN = /^https?:\/\//i;

const MIME_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/rtf': 'RTF',
  'application/vnd.oasis.opendocument.text': 'ODT',
  'text/plain': 'TXT',
};

export const uploadFileBaseSchema = z
  .object({
    originalName: z
      .string()
      .trim()
      .min(1, 'File name is required')
      .max(255, 'File name is too long'),
    mimeType: z.string().trim().min(1, 'MIME type is required').max(128, 'MIME type is too long'),
    sizeBytes: z.number().int().positive('File size must be greater than 0'),
  })
  .refine(
    (file) =>
      ALLOWED_DOCUMENT_MIME_TYPES.includes(
        file.mimeType as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number],
      ),
    {
      message: `Allowed: ${ALLOWED_DOCUMENT_MIME_TYPES.map((t) => MIME_TYPE_LABELS[t]).join(', ')}`,
      path: ['mimeType'],
    },
  )
  .refine((file) => file.sizeBytes <= MAX_DOCUMENT_SIZE_BYTES, {
    message: `File must be ≤ ${MAX_DOCUMENT_SIZE_BYTES / (1024 * 1024)} MB`,
    path: ['sizeBytes'],
  });

export const profileUrlSchema = z
  .string()
  .trim()
  .min(1, 'URL is required')
  .url({ message: 'Must be a valid URL' })
  .max(2048, 'Must contain at most 2048 characters')
  .refine((value) => HTTP_URL_PATTERN.test(value), {
    message: 'URL must start with http:// or https://',
  });

const SAFE_STORAGE_PATH_PATTERN = /^uploads\/[a-z0-9/_-]+$/;

export const uploadFileSubmitSchema = z.object({
  path: z
    .string()
    .trim()
    .min(5, 'Path is required')
    .max(512, 'Path is too long')
    .regex(SAFE_STORAGE_PATH_PATTERN, 'Invalid storage path format'),
  originalName: z.string().trim().min(1, 'File name is required').max(255, 'File name is too long'),
  mimeType: z.string().trim().min(1, 'MIME type is required').max(128, 'MIME type is too long'),
  sizeBytes: z.number().int().positive('File size must be greater than 0'),
});

export const candidateSubmitSchema = z
  .object({
    profileUrl: profileUrlSchema,
    cvFile: uploadFileSubmitSchema.optional(),
  })
  .refine((data) => !!data.cvFile, {
    message: 'CV is required',
    path: ['cvFile'],
  });
