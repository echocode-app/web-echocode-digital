import { getFirestoreDb } from '@/server/firebase/firestore';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { randomUUID } from 'node:crypto';
import {
  recordOverviewCreated,
  recordOverviewDeleted,
  recordOverviewStatusChanged,
} from '@/server/admin/submissions/overviewStats.repository';
import { ApiError } from '@/server/lib/errors';
import {
  fromCreatedSubmissionSnapshot,
  isDeletedSubmissionDoc,
  timestampToIsoString,
  toSubmissionFirestoreCreateDoc,
  toSubmissionRecordDto,
} from '@/server/submissions/submissions.mapper';
import type {
  AddSubmissionCommentInput,
  AddSubmissionCommentResponseDto,
  CreateSubmissionRecordInput,
  CreatedSubmissionRecord,
  SoftDeleteSubmissionInput,
  SoftDeleteSubmissionResponseDto,
  SubmissionRecordDto,
  SubmissionWorkflowStatus,
  UpdateSubmissionStatusInput,
  UpdateSubmissionStatusResponseDto,
} from '@/server/submissions/submissions.types';

function normalizeStoredSubmissionStatus(value: unknown): SubmissionWorkflowStatus | null {
  if (
    value === 'new' ||
    value === 'viewed' ||
    value === 'processed' ||
    value === 'rejected' ||
    value === 'deferred'
  ) {
    return value;
  }

  if (value === 'in_review') return 'viewed';
  if (value === 'contacted') return 'processed';
  if (value === 'closed') return 'deferred';

  return null;
}

export async function createSubmissionRecord(
  input: CreateSubmissionRecordInput,
): Promise<CreatedSubmissionRecord> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection('submissions').doc();

  try {
    await docRef.set(toSubmissionFirestoreCreateDoc(input));
    const snapshot = await docRef.get();
    const created = fromCreatedSubmissionSnapshot(snapshot);

    if (input.siteId === 'echocode_app') {
      await recordOverviewCreated({
        kind: 'echocode_app_submissions',
        createdAt: created.createdAt.toDate(),
        status: 'new',
      }).catch(() => undefined);
    }

    return created;
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;

    throw ApiError.fromCode(
      'FIREBASE_UNAVAILABLE',
      'Failed to create forms submission in Firestore',
      { cause },
    );
  }
}

export async function updateSubmissionStatusRecord(input: UpdateSubmissionStatusInput): Promise<{
  updated: UpdateSubmissionStatusResponseDto;
  previousStatus: SubmissionWorkflowStatus;
}> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection('submissions').doc(input.submissionId);

  try {
    const existingSnapshot = await docRef.get();
    if (!existingSnapshot.exists) {
      throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
    }

    const existingData = existingSnapshot.data();
    if (!existingData || typeof existingData.status !== 'string') {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Submission status is invalid');
    }

    const previousStatus = normalizeStoredSubmissionStatus(existingData.status);
    if (!previousStatus) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Submission status is invalid');
    }
    const createdAt = existingData.createdAt;
    if (!(createdAt instanceof Timestamp)) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Submission createdAt is invalid');
    }
    const siteId = existingData.siteId;

    await docRef.update({
      status: input.status,
      updatedBy: input.updatedBy,
      updatedAt: FieldValue.serverTimestamp(),
      reviewedBy: input.updatedBy,
      reviewedAt: FieldValue.serverTimestamp(),
    });

    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
    }

    const data = snapshot.data();
    if (!data) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Updated submission payload is missing');
    }

    if (!(data.updatedAt instanceof Timestamp)) {
      throw ApiError.fromCode(
        'INTERNAL_ERROR',
        `Submission "${input.submissionId}" is missing valid updatedAt`,
      );
    }

    if (siteId === 'echocode_app') {
      await recordOverviewStatusChanged({
        kind: 'echocode_app_submissions',
        createdAt: createdAt.toDate(),
        previousStatus,
        nextStatus: input.status,
      }).catch(() => undefined);
    }

    return {
      updated: {
        id: snapshot.id,
        status: input.status,
        updatedAt: timestampToIsoString(data.updatedAt),
        updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : null,
        reviewedBy: typeof data.reviewedBy === 'string' ? data.reviewedBy : null,
        reviewedAt:
          data.reviewedAt instanceof Timestamp ? timestampToIsoString(data.reviewedAt) : null,
      },
      previousStatus,
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to update submission status', {
      cause,
    });
  }
}

export async function getSubmissionById(
  submissionId: string,
  options?: { includeDeleted?: boolean },
): Promise<SubmissionRecordDto | null> {
  const firestore = getFirestoreDb();

  let snapshot: FirebaseFirestore.DocumentSnapshot;
  try {
    snapshot = await firestore.collection('submissions').doc(submissionId).get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load submission', { cause });
  }

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (!data) {
    throw ApiError.fromCode('INTERNAL_ERROR', 'Submission payload is missing');
  }

  if (!options?.includeDeleted && isDeletedSubmissionDoc(data)) {
    return null;
  }

  return toSubmissionRecordDto(snapshot.id, data);
}

export async function addSubmissionCommentRecord(
  input: AddSubmissionCommentInput,
): Promise<AddSubmissionCommentResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection('submissions').doc(input.submissionId);
  const commentId = randomUUID();

  try {
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
    }

    const data = snapshot.data();
    if (!data || isDeletedSubmissionDoc(data)) {
      throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
    }

    const now = Timestamp.now();
    const comment = {
      id: commentId,
      text: input.comment.trim(),
      authorUid: input.adminUid,
      authorEmail: input.adminEmail,
      createdAt: now,
    };

    await docRef.update({
      comments: FieldValue.arrayUnion(comment),
      updatedBy: input.adminUid,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedSnapshot = await docRef.get();
    const updatedData = updatedSnapshot.data();
    if (!updatedData || !(updatedData.updatedAt instanceof Timestamp)) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Updated submission payload is missing');
    }

    return {
      id: updatedSnapshot.id,
      comment: {
        id: comment.id,
        text: comment.text,
        authorUid: comment.authorUid,
        authorEmail: comment.authorEmail,
        createdAt: now.toDate().toISOString(),
      },
      updatedAt: timestampToIsoString(updatedData.updatedAt),
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to add submission comment', {
      cause,
    });
  }
}

export async function softDeleteSubmissionRecord(
  input: SoftDeleteSubmissionInput,
): Promise<SoftDeleteSubmissionResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection('submissions').doc(input.submissionId);

  try {
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
    }

    const data = snapshot.data();
    if (!data || isDeletedSubmissionDoc(data)) {
      throw ApiError.fromCode('BAD_REQUEST', `Submission "${input.submissionId}" not found`);
    }
    const createdAt = data.createdAt;
    const previousStatus = normalizeStoredSubmissionStatus(data.status) ?? 'new';
    const siteId = data.siteId;

    if (!(createdAt instanceof Timestamp)) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Submission createdAt is invalid');
    }

    await docRef.update({
      deletedBy: input.adminUid,
      deletedAt: FieldValue.serverTimestamp(),
      updatedBy: input.adminUid,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedSnapshot = await docRef.get();
    const updatedData = updatedSnapshot.data();
    if (!updatedData || !(updatedData.updatedAt instanceof Timestamp)) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Updated submission payload is missing');
    }

    if (siteId === 'echocode_app') {
      await recordOverviewDeleted({
        kind: 'echocode_app_submissions',
        createdAt: createdAt.toDate(),
        status: previousStatus,
      }).catch(() => undefined);
    }

    return {
      id: updatedSnapshot.id,
      isDeleted: true,
      updatedAt: timestampToIsoString(updatedData.updatedAt),
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to delete submission', {
      cause,
    });
  }
}
