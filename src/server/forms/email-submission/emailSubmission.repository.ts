import { FieldPath, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { randomUUID } from 'node:crypto';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import {
  MODERATION_SCAN_PAGE_SIZE,
  assertTimestamp,
  toIso,
  toModerationStatus,
} from '@/server/forms/shared/moderation.repository';
import {
  EMAIL_FALLBACK_SCAN_PAGE_SIZE,
  EMAIL_SUBMISSIONS_COLLECTION,
  isEmailSubmissionSoftDeleted,
} from '@/server/forms/email-submission/emailSubmission.repository.shared';
import {
  mapEmailSubmissionDocToCursor,
  mapEmailSubmissionDocToListItem,
  mapEmailSubmissionDocToRecord,
} from '@/server/forms/email-submission/emailSubmission.repository.mappers';
import { getEmailSubmissionsOverview } from '@/server/forms/email-submission/emailSubmission.repository.overview';
import type {
  AddEmailSubmissionCommentInput,
  AddEmailSubmissionCommentResponseDto,
  CreateEmailSubmissionResponseDto,
  EmailSubmissionCreateInput,
  EmailSubmissionCursor,
  EmailSubmissionListItemDto,
  EmailSubmissionRecordDto,
  EmailSubmissionStatus,
  SoftDeleteEmailSubmissionResponseDto,
  UpdateEmailSubmissionStatusResponseDto,
} from '@/server/forms/email-submission/emailSubmission.types';

type ListQueryInput = {
  limit: number;
  status?: EmailSubmissionStatus;
  dateFrom?: string;
  dateTo?: string;
  cursor?: EmailSubmissionCursor;
};

export async function createEmailSubmissionRecord(input: {
  payload: EmailSubmissionCreateInput;
}): Promise<CreateEmailSubmissionResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(EMAIL_SUBMISSIONS_COLLECTION).doc();

  const doc = {
    email: input.payload.email,
    source: input.payload.source ?? 'footer_mobile',
    status: 'new',
    isDeleted: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  try {
    await docRef.set(doc);
    const snapshot = await docRef.get();
    const data = snapshot.data();

    if (!snapshot.exists || !data) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Failed to read created email submission');
    }

    assertTimestamp(data.createdAt, `email_submissions/${docRef.id}.createdAt`);

    return {
      id: docRef.id,
      status: 'new',
      createdAt: toIso(data.createdAt),
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to create email submission', { cause });
  }
}

function buildListQuery(firestore: FirebaseFirestore.Firestore, input: ListQueryInput): FirebaseFirestore.Query {
  let query: FirebaseFirestore.Query = firestore.collection(EMAIL_SUBMISSIONS_COLLECTION);

  if (input.status) {
    query = query.where('status', '==', input.status);
  }

  if (input.dateFrom) {
    const from = new Date(`${input.dateFrom}T00:00:00.000Z`);
    query = query.where('createdAt', '>=', Timestamp.fromDate(from));
  }

  if (input.dateTo) {
    const to = new Date(`${input.dateTo}T23:59:59.999Z`);
    query = query.where('createdAt', '<=', Timestamp.fromDate(to));
  }

  query = query.orderBy('createdAt', 'desc').orderBy(FieldPath.documentId(), 'desc');

  if (input.cursor) {
    query = query.startAfter(Timestamp.fromMillis(input.cursor.createdAtMs), input.cursor.id);
  }

  return query;
}

async function listWithStatusFallback(
  firestore: FirebaseFirestore.Firestore,
  input: ListQueryInput,
): Promise<{ items: EmailSubmissionListItemDto[]; nextCursor: EmailSubmissionCursor | null; hasNextPage: boolean }> {
  let baseQuery: FirebaseFirestore.Query = firestore.collection(EMAIL_SUBMISSIONS_COLLECTION);

  if (input.dateFrom) {
    const from = new Date(`${input.dateFrom}T00:00:00.000Z`);
    baseQuery = baseQuery.where('createdAt', '>=', Timestamp.fromDate(from));
  }

  if (input.dateTo) {
    const to = new Date(`${input.dateTo}T23:59:59.999Z`);
    baseQuery = baseQuery.where('createdAt', '<=', Timestamp.fromDate(to));
  }

  baseQuery = baseQuery.orderBy('createdAt', 'desc').orderBy(FieldPath.documentId(), 'desc');
  if (input.cursor) {
    baseQuery = baseQuery.startAfter(Timestamp.fromMillis(input.cursor.createdAtMs), input.cursor.id);
  }

  const filtered: FirebaseFirestore.QueryDocumentSnapshot[] = [];
  let scanCursor: FirebaseFirestore.QueryDocumentSnapshot | null = null;
  let exhausted = false;

  // Fallback path is used when composite status+date index is missing.
  while (filtered.length < input.limit + 1 && !exhausted) {
    let batchQuery = baseQuery.limit(EMAIL_FALLBACK_SCAN_PAGE_SIZE);
    if (scanCursor) {
      batchQuery = batchQuery.startAfter(scanCursor);
    }

    let batchSnapshot: FirebaseFirestore.QuerySnapshot;
    try {
      batchSnapshot = await batchQuery.get();
    } catch (scanCause) {
      throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to list email submissions', { cause: scanCause });
    }

    if (batchSnapshot.empty) {
      exhausted = true;
      break;
    }

    batchSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (isEmailSubmissionSoftDeleted(data)) return;
      if (toModerationStatus(data.status) === input.status && filtered.length < input.limit + 1) {
        filtered.push(doc);
      }
    });

    scanCursor = batchSnapshot.docs[batchSnapshot.docs.length - 1] ?? null;
    if (batchSnapshot.size < EMAIL_FALLBACK_SCAN_PAGE_SIZE) {
      exhausted = true;
    }
  }

  const hasNextPage = filtered.length > input.limit;
  const pageDocs = hasNextPage ? filtered.slice(0, input.limit) : filtered;
  const items = pageDocs.map(mapEmailSubmissionDocToListItem);
  const nextCursor = hasNextPage && pageDocs.length > 0
    ? mapEmailSubmissionDocToCursor(pageDocs[pageDocs.length - 1])
    : null;

  return { items, nextCursor, hasNextPage };
}

export async function listEmailSubmissions(input: ListQueryInput): Promise<{
  items: EmailSubmissionListItemDto[];
  nextCursor: EmailSubmissionCursor | null;
  hasNextPage: boolean;
}> {
  const firestore = getFirestoreDb();
  const query = buildListQuery(firestore, input);

  try {
    const filtered: FirebaseFirestore.QueryDocumentSnapshot[] = [];
    let scanCursor: FirebaseFirestore.QueryDocumentSnapshot | null = null;
    let exhausted = false;

    while (filtered.length < input.limit + 1 && !exhausted) {
      let batchQuery = query.limit(MODERATION_SCAN_PAGE_SIZE);
      if (scanCursor) {
        batchQuery = batchQuery.startAfter(scanCursor);
      }

      const snapshot = await batchQuery.get();
      if (snapshot.empty) {
        exhausted = true;
        break;
      }

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (isEmailSubmissionSoftDeleted(data)) return;
        if (filtered.length < input.limit + 1) {
          filtered.push(doc);
        }
      });

      scanCursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
      if (snapshot.size < MODERATION_SCAN_PAGE_SIZE) {
        exhausted = true;
      }
    }

    const hasNextPage = filtered.length > input.limit;
    const pageDocs = hasNextPage ? filtered.slice(0, input.limit) : filtered;
    const items = pageDocs.map(mapEmailSubmissionDocToListItem);
    const nextCursor = hasNextPage && pageDocs.length > 0
      ? mapEmailSubmissionDocToCursor(pageDocs[pageDocs.length - 1])
      : null;

    return { items, nextCursor, hasNextPage };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    const requiresIndex = message.includes('FAILED_PRECONDITION') && message.includes('requires an index');

    if (!requiresIndex || !input.status) {
      throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to list email submissions', { cause });
    }

    return listWithStatusFallback(firestore, input);
  }
}

export async function getEmailSubmissionById(
  submissionId: string,
  options?: { includeDeleted?: boolean },
): Promise<EmailSubmissionRecordDto | null> {
  const firestore = getFirestoreDb();

  let snapshot: FirebaseFirestore.DocumentSnapshot;
  try {
    snapshot = await firestore.collection(EMAIL_SUBMISSIONS_COLLECTION).doc(submissionId).get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load email submission', { cause });
  }

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (!data) {
    throw ApiError.fromCode('INTERNAL_ERROR', `Email submission "${submissionId}" payload is missing`);
  }

  if (!options?.includeDeleted && isEmailSubmissionSoftDeleted(data)) {
    return null;
  }

  return mapEmailSubmissionDocToRecord(snapshot.id, data);
}

export async function updateEmailSubmissionStatus(input: {
  submissionId: string;
  status: EmailSubmissionStatus;
  adminUid: string;
}): Promise<{ previousStatus: EmailSubmissionStatus; updated: UpdateEmailSubmissionStatusResponseDto }> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(EMAIL_SUBMISSIONS_COLLECTION).doc(input.submissionId);

  try {
    return await firestore.runTransaction(async (tx) => {
      const snapshot = await tx.get(docRef);
      if (!snapshot.exists) {
        throw ApiError.fromCode('BAD_REQUEST', `Email submission "${input.submissionId}" not found`);
      }

      const data = snapshot.data();
      if (!data || isEmailSubmissionSoftDeleted(data)) {
        throw ApiError.fromCode('BAD_REQUEST', `Email submission "${input.submissionId}" not found`);
      }

      const previousStatus = toModerationStatus(data.status);
      const now = Timestamp.now();

      tx.update(docRef, {
        status: input.status,
        updatedAt: FieldValue.serverTimestamp(),
        reviewedBy: input.adminUid,
        reviewedAt: FieldValue.serverTimestamp(),
      });

      return {
        previousStatus,
        updated: {
          id: snapshot.id,
          status: input.status,
          updatedAt: now.toDate().toISOString(),
          reviewedBy: input.adminUid,
          reviewedAt: now.toDate().toISOString(),
        },
      };
    });
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to update email submission status', { cause });
  }
}

export async function addEmailSubmissionComment(
  input: AddEmailSubmissionCommentInput,
): Promise<AddEmailSubmissionCommentResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(EMAIL_SUBMISSIONS_COLLECTION).doc(input.submissionId);
  const commentId = randomUUID();

  try {
    return await firestore.runTransaction(async (tx) => {
      const snapshot = await tx.get(docRef);
      if (!snapshot.exists) {
        throw ApiError.fromCode('BAD_REQUEST', `Email submission "${input.submissionId}" not found`);
      }

      const data = snapshot.data();
      if (!data || isEmailSubmissionSoftDeleted(data)) {
        throw ApiError.fromCode('BAD_REQUEST', `Email submission "${input.submissionId}" not found`);
      }

      const createdAt = Timestamp.now();
      const comment = {
        id: commentId,
        text: input.comment.trim(),
        authorUid: input.adminUid,
        authorEmail: input.adminEmail,
        createdAt,
      };

      tx.update(docRef, {
        comments: FieldValue.arrayUnion(comment),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        id: snapshot.id,
        comment: {
          id: commentId,
          text: comment.text,
          authorUid: comment.authorUid,
          authorEmail: comment.authorEmail,
          createdAt: toIso(createdAt),
        },
        updatedAt: toIso(createdAt),
      };
    });
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to add email submission comment', { cause });
  }
}

export async function softDeleteEmailSubmission(input: {
  submissionId: string;
  adminUid: string;
}): Promise<SoftDeleteEmailSubmissionResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(EMAIL_SUBMISSIONS_COLLECTION).doc(input.submissionId);

  try {
    return await firestore.runTransaction(async (tx) => {
      const snapshot = await tx.get(docRef);
      if (!snapshot.exists) {
        throw ApiError.fromCode('BAD_REQUEST', `Email submission "${input.submissionId}" not found`);
      }

      const data = snapshot.data();
      if (!data || isEmailSubmissionSoftDeleted(data)) {
        throw ApiError.fromCode('BAD_REQUEST', `Email submission "${input.submissionId}" not found`);
      }

      const now = Timestamp.now();

      tx.update(docRef, {
        isDeleted: true,
        deletedBy: input.adminUid,
        deletedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        id: snapshot.id,
        isDeleted: true,
        updatedAt: toIso(now),
      };
    });
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to delete email submission', { cause });
  }
}

export { getEmailSubmissionsOverview };
