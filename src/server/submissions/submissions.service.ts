import { ApiError } from '@/server/lib/errors';
import {
  buildSubmissionDraft,
  parseSubmissionCreatePayload,
} from '@/server/submissions/validation';
import { verifyUploadedProjectAttachment } from '@/server/submissions/submissions.upload.service';
import { createSubmissionRecord } from '@/server/submissions/submissions.repository';
import { toCreateSubmissionResponseDto } from '@/server/submissions/submissions.mapper';
import type {
  CreateProjectSubmissionParams,
  CreateSubmissionRecordInput,
  CreateSubmissionResponseDto,
} from '@/server/submissions/submissions.types';

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOwnKey<T extends string>(
  value: Record<string, unknown>,
  key: T,
): value is Record<T, unknown> & Record<string, unknown> {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function assertPreParseSubmissionGuards(rawBody: unknown): void {
  if (!isObjectRecord(rawBody)) return;

  // Preserve explicit candidate=NOT_IMPLEMENTED even when candidate file metadata is malformed.
  if (rawBody.formType === 'candidate') {
    throw ApiError.fromCode(
      'NOT_IMPLEMENTED',
      'Candidate form submissions are not implemented in Commit 1',
    );
  }

  if (
    rawBody.formType === 'project' &&
    hasOwnKey(rawBody, 'attachment') &&
    rawBody.attachment != null
  ) {
    return;
  }
}

function toCreateRecordInputFromProjectDraft(
  draft: ReturnType<typeof buildSubmissionDraft>,
): CreateSubmissionRecordInput {
  if (draft.formType !== 'project') {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Expected project submission draft for Commit 1 create flow',
    );
  }

  if (!draft.email) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Project submission draft is missing email after normalization',
    );
  }

  if (!draft.name) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Project submission draft is missing name after normalization',
    );
  }

  return {
    formType: 'project',
    contact: {
      email: draft.email,
      name: draft.name,
    },
    content: {
      message: draft.message ?? null,
      profileUrl: null,
    },
    attachments: draft.attachments,
  };
}

export async function createProjectSubmission(
  params: CreateProjectSubmissionParams,
): Promise<CreateSubmissionResponseDto> {
  // Run contract guards before shared schema validation to keep stable error codes.
  assertPreParseSubmissionGuards(params.rawBody);

  const parsed = parseSubmissionCreatePayload(params.rawBody);

  if (parsed.formType === 'candidate') {
    throw ApiError.fromCode(
      'NOT_IMPLEMENTED',
      'Candidate form submissions are not implemented in Commit 1',
    );
  }

  if (parsed.attachment != null) {
    // Verify uploaded object metadata before persisting any Firestore record.
    await verifyUploadedProjectAttachment({
      path: parsed.attachment.path,
      mimeType: parsed.attachment.mimeType,
      sizeBytes: parsed.attachment.sizeBytes,
    });
  }

  const draft = buildSubmissionDraft(parsed);
  if (draft.attachments.length > 1) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Project submission draft produced more than one attachment in single-file flow',
    );
  }

  const recordInput = toCreateRecordInputFromProjectDraft(draft);
  const createdRecord = await createSubmissionRecord(recordInput);

  return toCreateSubmissionResponseDto(createdRecord);
}
