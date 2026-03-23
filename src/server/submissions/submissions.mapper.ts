import {
  FieldValue,
  Timestamp,
  type QueryDocumentSnapshot,
  type DocumentSnapshot,
} from 'firebase-admin/firestore';
import { ApiError } from '@/server/lib/errors';
import { mapComments } from '@/server/forms/shared/moderation.repository';
import { SITE_IDS, type SiteId } from '@/server/sites/siteContext';
import { SUBMISSION_LIST_STATUSES } from '@/server/submissions/submissions.types';
import type {
  SubmissionAttachmentMvp,
  CreateSubmissionRecordInput,
  CreateSubmissionResponseDto,
  CreatedSubmissionRecord,
  SubmissionDetailsDto,
  SubmissionListItemDto,
  SubmissionListStatus,
  SubmissionFirestoreDocMvp,
  SubmissionRecordDto,
} from '@/server/submissions/submissions.types';

export function toSubmissionFirestoreCreateDoc(
  input: CreateSubmissionRecordInput,
): SubmissionFirestoreDocMvp {
  // Centralize Firestore write shape so service code stays schema-agnostic.
  return {
    formType: input.formType,
    status: 'new',
    siteId: input.siteId,
    siteHost: input.siteHost,
    source: input.source,
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

function normalizeSubmissionStatus(value: unknown): SubmissionListStatus | null {
  if (isSubmissionListStatus(value)) return value;
  if (value === 'in_review') return 'viewed';
  if (value === 'contacted') return 'processed';
  if (value === 'closed') return 'deferred';
  return null;
}

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function toNullableSiteId(value: unknown): SiteId | null {
  if (typeof value !== 'string') {
    return null;
  }

  return SITE_IDS.includes(value as SiteId) ? (value as SiteId) : null;
}

function toIsoTimestamp(value: unknown, fallbackLabel: string): string {
  if (!(value instanceof Timestamp)) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      `${fallbackLabel} is missing valid timestamp`,
    );
  }
  return timestampToIsoString(value);
}

function toObjectRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function toAttachments(value: unknown): SubmissionAttachmentMvp[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    const attachment = toObjectRecord(entry);
    if (!attachment) return [];
    if (
      typeof attachment.path !== 'string' ||
      typeof attachment.originalName !== 'string' ||
      typeof attachment.mimeType !== 'string' ||
      typeof attachment.sizeBytes !== 'number' ||
      (attachment.kind !== 'image' && attachment.kind !== 'document')
    ) {
      return [];
    }

    return [{
      path: attachment.path,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      sizeBytes: attachment.sizeBytes,
      kind: attachment.kind,
    }];
  });
}

export function toSubmissionListItemDto(
  snapshot: QueryDocumentSnapshot,
): SubmissionListItemDto {
  // Admin list DTO intentionally excludes message/body and raw attachment metadata.
  const data = snapshot.data();

  const status = normalizeSubmissionStatus(data.status);
  if (!status) {
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
  const commentsCount = Array.isArray(data.comments) ? data.comments.length : 0;

  return {
    id: snapshot.id,
    formType: data.formType,
    status,
    siteId: toNullableSiteId(data.siteId),
    siteHost: toNullableString(data.siteHost),
    source: toNullableString(data.source),
    contact: {
      name: contact ? toNullableString(contact.name) : null,
      email: contact ? toNullableString(contact.email) : null,
    },
    hasAttachment: attachments.length > 0,
    commentsCount:
      Number.isFinite(commentsCount) && commentsCount > 0 ? Math.trunc(commentsCount) : 0,
    createdAt: toIsoTimestamp(createdAt, `Submission "${snapshot.id}" createdAt`),
  };
}

export function isDeletedSubmissionDoc(data: Record<string, unknown>): boolean {
  return data.deletedAt instanceof Timestamp;
}

export function toSubmissionRecordDto(
  snapshotId: string,
  data: Record<string, unknown>,
): SubmissionRecordDto {
  if (data.formType !== 'project') {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      `Submission "${snapshotId}" has unsupported formType`,
    );
  }

  const status = normalizeSubmissionStatus(data.status);
  if (!status) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      `Submission "${snapshotId}" has unsupported status`,
    );
  }

  const contact = toObjectRecord(data.contact);
  const content = toObjectRecord(data.content);

  if (
    !contact ||
    typeof contact.name !== 'string' ||
    typeof contact.email !== 'string'
  ) {
    throw ApiError.fromCode(
      'INTERNAL_ERROR',
      `Submission "${snapshotId}" is missing valid contact payload`,
    );
  }

  const createdAt = toIsoTimestamp(data.createdAt, `Submission "${snapshotId}" createdAt`);
  const updatedAt = toIsoTimestamp(data.updatedAt, `Submission "${snapshotId}" updatedAt`);

  return {
    id: snapshotId,
    formType: 'project',
    status,
    siteId: toNullableSiteId(data.siteId),
    siteHost: toNullableString(data.siteHost),
    source: toNullableString(data.source),
    contact: {
      name: contact.name,
      email: contact.email,
    },
    content: {
      message: content ? toNullableString(content.message) : null,
      profileUrl: null,
    },
    attachments: toAttachments(data.attachments),
    createdAt,
    updatedAt,
    reviewedBy: toNullableString(data.reviewedBy),
    reviewedByProfile: null,
    reviewedAt:
      data.reviewedAt instanceof Timestamp ? timestampToIsoString(data.reviewedAt) : null,
    comments: mapComments(data.comments),
  };
}

export function toSubmissionDetailsDto(item: SubmissionRecordDto): SubmissionDetailsDto {
  return { item };
}
