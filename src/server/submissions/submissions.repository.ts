import { getFirestoreDb } from '@/server/firebase/firestore';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { ApiError } from '@/server/lib/errors';
import {
  fromCreatedSubmissionSnapshot,
  timestampToIsoString,
  toSubmissionFirestoreCreateDoc,
} from '@/server/submissions/submissions.mapper';
import type {
  CreateSubmissionRecordInput,
  CreatedSubmissionRecord,
  UpdateSubmissionStatusInput,
  UpdateSubmissionStatusResponseDto,
} from '@/server/submissions/submissions.types';

export async function createSubmissionRecord(
  input: CreateSubmissionRecordInput,
): Promise<CreatedSubmissionRecord> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection('submissions').doc();

  try {
    await docRef.set(toSubmissionFirestoreCreateDoc(input));
    const snapshot = await docRef.get();
    return fromCreatedSubmissionSnapshot(snapshot);
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;

    throw ApiError.fromCode(
      'FIREBASE_UNAVAILABLE',
      'Failed to create forms submission in Firestore',
      { cause },
    );
  }
}

export async function updateSubmissionStatusRecord(
  input: UpdateSubmissionStatusInput,
): Promise<UpdateSubmissionStatusResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection('submissions').doc(input.submissionId);

  try {
    await docRef.update({
      status: input.status,
      updatedBy: input.updatedBy,
      updatedAt: FieldValue.serverTimestamp(),
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

    return {
      id: snapshot.id,
      status: input.status,
      updatedAt: timestampToIsoString(data.updatedAt),
      updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : null,
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to update submission status', {
      cause,
    });
  }
}
