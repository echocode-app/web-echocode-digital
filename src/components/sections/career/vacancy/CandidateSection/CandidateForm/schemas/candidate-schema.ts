import { z } from 'zod';
import { ALLOWED_DOCUMENT_MIME_TYPES, MAX_DOCUMENT_SIZE_BYTES } from '@/shared/validation';

const HTTP_URL_PATTERN = /^https?:\/\//i;

// const MIME_TYPE_LABELS: Record<string, string> = {
//   'application/pdf': 'PDF',
//   'application/msword': 'DOC',
//   'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
//   'application/rtf': 'RTF',
//   'application/vnd.oasis.opendocument.text': 'ODT',
//   'text/plain': 'TXT',
// };

export const uploadFileBaseSchema = z
  .object({
    originalName: z
      .string()
      .trim()
      .min(1, 'VacancyValidation.file.nameRequired')
      .max(255, 'VacancyValidation.file.nameTooLong'),
    mimeType: z
      .string()
      .trim()
      .min(1, 'VacancyValidation.file.mimeRequired')
      .max(128, 'VacancyValidation.file.mimeTooLong'),
    sizeBytes: z.number().int().positive('VacancyValidation.file.sizePositive'),
  })
  .refine(
    (file) =>
      ALLOWED_DOCUMENT_MIME_TYPES.includes(
        file.mimeType as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number],
      ),
    {
      message: 'VacancyValidation.file.mimeInvalid',
      path: ['mimeType'],
    },
  )
  .refine((file) => file.sizeBytes <= MAX_DOCUMENT_SIZE_BYTES, {
    message: 'VacancyValidation.file.sizeMax',
    path: ['sizeBytes'],
  });

export const profileUrlSchema = z
  .string()
  .trim()
  .min(1, 'VacancyValidation.profileUrl.required')
  .url({ message: 'VacancyValidation.profileUrl.invalid' })
  .max(2048, 'VacancyValidation.profileUrl.maxLength')
  .refine((value) => HTTP_URL_PATTERN.test(value), {
    message: 'VacancyValidation.profileUrl.scheme',
  });

const SAFE_STORAGE_PATH_PATTERN = /^uploads\/[a-z0-9/_-]+$/;

export const uploadFileSubmitSchema = z.object({
  path: z
    .string()
    .trim()
    .min(5, 'VacancyValidation.file.pathRequired')
    .max(512, 'VacancyValidation.file.pathTooLong')
    .regex(SAFE_STORAGE_PATH_PATTERN, 'VacancyValidation.file.pathInvalid'),
  originalName: z
    .string()
    .trim()
    .min(1, 'VacancyValidation.file.nameRequired')
    .max(255, 'VacancyValidation.file.nameTooLong'),
  mimeType: z
    .string()
    .trim()
    .min(1, 'VacancyValidation.file.mimeRequired')
    .max(128, 'VacancyValidation.file.mimeTooLong'),
  sizeBytes: z.number().int().positive('VacancyValidation.file.sizePositive'),
});

export const candidateSubmitSchema = z
  .object({
    profileUrl: profileUrlSchema,
    cvFile: uploadFileSubmitSchema.optional(),
  })
  .refine((data) => !!data.cvFile, {
    message: 'VacancyValidation.cv.required',
    path: ['cvFile'],
  });
