import { ApiError } from '@/server/lib/errors';
import {
  buildSubmissionDraft,
  parseSubmissionCreatePayload,
} from '@/server/submissions/validation';
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

function assertCommit1PreParseGuards(rawBody: unknown): void {
  if (!isObjectRecord(rawBody)) return;

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
    throw ApiError.fromCode(
      'ATTACHMENT_NOT_SUPPORTED_YET',
      'Project attachment upload is not supported in Commit 1',
    );
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
    attachments: [],
  };
}

export async function createProjectSubmission(
  params: CreateProjectSubmissionParams,
): Promise<CreateSubmissionResponseDto> {
  // Commit 1 contract requires these responses even if file metadata is malformed.
  assertCommit1PreParseGuards(params.rawBody);

  const parsed = parseSubmissionCreatePayload(params.rawBody);

  if (parsed.formType === 'candidate') {
    throw ApiError.fromCode(
      'NOT_IMPLEMENTED',
      'Candidate form submissions are not implemented in Commit 1',
    );
  }

  if (parsed.attachment != null) {
    throw ApiError.fromCode(
      'ATTACHMENT_NOT_SUPPORTED_YET',
      'Project attachment upload is not supported in Commit 1',
    );
  }

  const draft = buildSubmissionDraft(parsed);
  const recordInput = toCreateRecordInputFromProjectDraft(draft);
  const createdRecord = await createSubmissionRecord(recordInput);

  return toCreateSubmissionResponseDto(createdRecord);
}
