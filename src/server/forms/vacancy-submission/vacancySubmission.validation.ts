import { z } from 'zod';
import {
  candidateCvFileSchema,
} from '@/shared/validation/submissions';
import { profileUrlSchema } from '@/shared/validation/submissions.common';
import { SUBMISSIONS_TMP_UPLOAD_PATH_PATTERN } from '@/shared/forms/submissionsUpload.constants';
import { validate } from '@/server/lib';
import {
  decodeModerationCursor,
  encodeModerationCursor,
  moderationCommentSchema,
  moderationListQuerySchema,
  moderationSubmissionIdQuerySchema,
  moderationUpdateStatusSchema,
} from '@/server/forms/shared/moderation.validation';
import type {
  VacancySubmissionCreateInput,
  VacancySubmissionCursor,
  VacancySubmissionListQueryInput,
} from '@/server/forms/vacancy-submission/vacancySubmission.types';

const SUSPICIOUS_EXTENSION_PATTERN = /(exe|dll|bat|cmd|com|msi|sh|php|pl|py|jar|apk|bin)$/i;

// Reuse shared candidate CV validation and enforce strict tmp-upload path for backend submit flow.
const cvFileSchema = candidateCvFileSchema.refine(
  (value) => SUBMISSIONS_TMP_UPLOAD_PATH_PATTERN.test(value.path),
  {
    message: 'Invalid CV upload path format',
    path: ['path'],
  },
);

const vacancySnapshotSchema = z.object({
  vacancyId: z.string().trim().min(1).max(120),
  vacancySlug: z.string().trim().min(1).max(160).optional(),
  vacancyTitle: z.string().trim().min(1).max(200).optional(),
  level: z.string().trim().min(1).max(80).optional(),
  conditions: z.array(z.string().trim().min(1).max(80)).max(12).optional(),
  employmentType: z.string().trim().min(1).max(80).optional(),
});

export const vacancySubmissionCreateSchema = z.object({
  profileUrl: profileUrlSchema.max(600),
  cvFile: cvFileSchema,
  vacancy: vacancySnapshotSchema,
});

export const vacancySubmissionListQuerySchema = moderationListQuerySchema.extend({
  vacancyKey: z.string().trim().min(1).max(180).optional(),
});

export const updateVacancySubmissionStatusSchema = moderationUpdateStatusSchema;
export const addVacancySubmissionCommentSchema = moderationCommentSchema;
export const vacancySubmissionIdQuerySchema = moderationSubmissionIdQuerySchema;

function getSafeExtension(name: string): string {
  const segments = name.toLowerCase().split('.').filter(Boolean);
  return segments[segments.length - 1] ?? '';
}

export function assertSafeCvFileName(originalName: string): void {
  const fileName = originalName.trim().toLowerCase();
  const extension = getSafeExtension(fileName);

  if (extension.length === 0) {
    throw new Error('CV file extension is required');
  }

  const trailingParts = fileName.split('.').filter(Boolean).slice(1);
  if (trailingParts.some((part) => SUSPICIOUS_EXTENSION_PATTERN.test(part))) {
    throw new Error('Suspicious CV extension sequence');
  }
}

export function parseVacancySubmissionCreatePayload(input: unknown): VacancySubmissionCreateInput {
  return validate(vacancySubmissionCreateSchema, input);
}

export function parseVacancySubmissionListQuery(input: unknown): VacancySubmissionListQueryInput {
  return validate(vacancySubmissionListQuerySchema, input);
}

export function decodeVacancySubmissionCursor(raw: string): VacancySubmissionCursor {
  return decodeModerationCursor(raw);
}

export function encodeVacancySubmissionCursor(cursor: VacancySubmissionCursor): string {
  return encodeModerationCursor(cursor);
}
