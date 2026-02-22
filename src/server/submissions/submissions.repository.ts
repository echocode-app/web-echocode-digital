import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import {
  fromCreatedSubmissionSnapshot,
  toSubmissionFirestoreCreateDoc,
} from '@/server/submissions/submissions.mapper';
import type {
  CreateSubmissionRecordInput,
  CreatedSubmissionRecord,
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
