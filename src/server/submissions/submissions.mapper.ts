import {
  FieldValue,
  Timestamp,
  type DocumentSnapshot,
} from 'firebase-admin/firestore';
import { ApiError } from '@/server/lib/errors';
import type {
  CreateSubmissionRecordInput,
  CreateSubmissionResponseDto,
  CreatedSubmissionRecord,
  SubmissionFirestoreDocMvp,
} from '@/server/submissions/submissions.types';

export function toSubmissionFirestoreCreateDoc(
  input: CreateSubmissionRecordInput,
): SubmissionFirestoreDocMvp {
  return {
    formType: input.formType,
    status: 'new',
    contact: input.contact,
    content: input.content,
    attachments: input.attachments,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

function assertTimestamp(value: unknown, field: string): asserts value is Timestamp {
  if (!(value instanceof Timestamp)) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      `Created submission ${field} is missing after write`,
    );
  }
}

export function fromCreatedSubmissionSnapshot(
  snapshot: DocumentSnapshot,
): CreatedSubmissionRecord {
  if (!snapshot.exists) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Created submission document is missing after write',
    );
  }

  const data = snapshot.data();
  if (!data) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Created submission document payload is missing after write',
    );
  }

  if (data.formType !== 'project') {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Created submission has unexpected formType after write',
    );
  }

  if (data.status !== 'new') {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      'Created submission has unexpected status after write',
    );
  }

  const createdAt = data.createdAt;
  const updatedAt = data.updatedAt;
  assertTimestamp(createdAt, 'createdAt');
  assertTimestamp(updatedAt, 'updatedAt');

  return {
    id: snapshot.id,
    formType: 'project',
    status: 'new',
    createdAt,
    updatedAt,
  };
}

export function timestampToIsoString(timestamp: Timestamp): string {
  return timestamp.toDate().toISOString();
}

export function toCreateSubmissionResponseDto(
  record: CreatedSubmissionRecord,
): CreateSubmissionResponseDto {
  return {
    id: record.id,
    status: record.status,
    createdAt: timestampToIsoString(record.createdAt),
  };
}
