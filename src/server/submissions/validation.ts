import {
  isImageMimeType,
  submissionCreateSchema,
  type SubmissionCreateInput,
  type UploadedFileInput,
} from '@/shared/validation/submissions';
import { validate } from '@/server/lib/validate';

/** Attachment shape used in normalized submission payloads. */
export type SubmissionAttachment = {
  path: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  kind: 'image' | 'document';
};

/**
 * Normalized submission shape for service/controller layers.
 * Candidate draft intentionally has no `email/name` in current CV+link contract.
 * `source` is assigned server-side (`website`) in current iteration.
 */
export type SubmissionDraft = {
  formType: SubmissionCreateInput['formType'];
  email?: string;
  name?: string;
  message?: string;
  source?: string;
  attachments: SubmissionAttachment[];
  metadata?: Record<string, unknown>;
};

/** Maps validated file input to attachment shape. */
function toAttachment(file: UploadedFileInput): SubmissionAttachment {
  return {
    path: file.path,
    originalName: file.originalName,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    kind: isImageMimeType(file.mimeType) ? 'image' : 'document',
  };
}

/** Parses and validates unknown body to typed submission input. */
export function parseSubmissionCreatePayload(input: unknown): SubmissionCreateInput {
  return validate(submissionCreateSchema, input);
}

/** Builds a normalized draft from validated form input. */
export function buildSubmissionDraft(input: SubmissionCreateInput): SubmissionDraft {
  if (input.formType === 'project') {
    const name = `${input.firstName} ${input.lastName}`.replace(/\s+/g, ' ').trim();

    return {
      formType: input.formType,
      email: input.email,
      name,
      message: input.needs,
      source: input.source,
      attachments: input.attachment ? [toAttachment(input.attachment)] : [],
    };
  }

  return {
    formType: input.formType,
    attachments: [toAttachment(input.cvFile)],
    metadata: {
      profileUrl: input.profileUrl,
    },
  };
}
