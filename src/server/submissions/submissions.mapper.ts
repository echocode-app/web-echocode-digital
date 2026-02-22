import {
  FieldValue,
  Timestamp,
  type QueryDocumentSnapshot,
  type DocumentSnapshot,
} from 'firebase-admin/firestore';
import { ApiError } from '@/server/lib/errors';
import { SUBMISSION_LIST_STATUSES } from '@/server/submissions/submissions.types';
import type {
  CreateSubmissionRecordInput,
  CreateSubmissionResponseDto,
  CreatedSubmissionRecord,
  SubmissionListItemDto,
  SubmissionListStatus,
  SubmissionFirestoreDocMvp,
} from '@/server/submissions/submissions.types';

export function toSubmissionFirestoreCreateDoc(
  input: CreateSubmissionRecordInput,
): SubmissionFirestoreDocMvp {
  // Centralize Firestore write shape so service code stays schema-agnostic.
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

function isSubmissionListStatus(value: unknown): value is SubmissionListStatus {
  return SUBMISSION_LIST_STATUSES.includes(value as SubmissionListStatus);
}

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function toObjectRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function toSubmissionListItemDto(
  snapshot: QueryDocumentSnapshot,
): SubmissionListItemDto {
  // Admin list DTO intentionally excludes message/body and raw attachment metadata.
  const data = snapshot.data();

  if (!isSubmissionListStatus(data.status)) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      `Submission "${snapshot.id}" has unsupported status for admin list`,
    );
  }

  const createdAt = data.createdAt;
  if (!(createdAt instanceof Timestamp)) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      `Submission "${snapshot.id}" is missing valid createdAt timestamp`,
    );
  }

  if (typeof data.formType !== 'string') {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      `Submission "${snapshot.id}" is missing valid formType`,
    );
  }

  const contact = toObjectRecord(data.contact);
  const attachments = Array.isArray(data.attachments) ? data.attachments : [];

  return {
    id: snapshot.id,
    formType: data.formType,
    status: data.status,
    contact: {
      name: contact ? toNullableString(contact.name) : null,
      email: contact ? toNullableString(contact.email) : null,
    },
    hasAttachment: attachments.length > 0,
    createdAt: timestampToIsoString(createdAt),
  };
}
