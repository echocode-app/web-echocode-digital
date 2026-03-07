import { FieldPath, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { randomUUID } from 'node:crypto';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import {
  CLIENT_SUBMISSIONS_COLLECTION,
  CLIENT_SUBMISSION_STATUS_ORDER,
  FALLBACK_SCAN_PAGE_SIZE,
  assertTimestamp,
  toIso,
} from '@/server/forms/client-project/clientProject.repository.shared';
import {
  mapDocToCursor,
  mapDocToListItem,
  mapDocToRecord,
} from '@/server/forms/client-project/clientProject.repository.mappers';
import { getClientSubmissionsOverview } from '@/server/forms/client-project/clientProject.repository.overview';
import type {
  AddClientSubmissionCommentInput,
  AddClientSubmissionCommentResponseDto,
  ClientProjectCreateInput,
  ClientSubmissionCommentStored,
  ClientSubmissionCursor,
  ClientSubmissionListItemDto,
  ClientSubmissionRecordDto,
  ClientSubmissionStatus,
  CreateClientSubmissionResponseDto,
  SoftDeleteClientSubmissionResponseDto,
  UpdateClientSubmissionStatusResponseDto,
} from '@/server/forms/client-project/clientProject.types';

type ListQueryInput = {
  limit: number;
  status?: ClientSubmissionStatus;
  dateFrom?: string;
  dateTo?: string;
  cursor?: ClientSubmissionCursor;
};

function isSoftDeleted(data: Record<string, unknown>): boolean {
  return data.isDeleted === true;
}

export async function createClientSubmissionRecord(input: {
  payload: ClientProjectCreateInput;
  imageUrl: string | null;
}): Promise<CreateClientSubmissionResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(CLIENT_SUBMISSIONS_COLLECTION).doc();

  const doc = {
    firstName: input.payload.firstName,
    lastName: input.payload.lastName,
    email: input.payload.email,
    description: input.payload.description?.trim() || null,
    ...(input.imageUrl
      ? {
          imageUrl: input.imageUrl,
          imagePath: input.payload.image?.path,
          imageName: input.payload.image?.originalName,
        }
      : {}),
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
      throw ApiError.fromCode('INTERNAL_ERROR', 'Failed to read created client submission');
    }

    assertTimestamp(data.createdAt, `client_submissions/${docRef.id}.createdAt`);

    return {
      id: docRef.id,
      status: 'new',
      createdAt: toIso(data.createdAt),
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to create client submission', {
      cause,
    });
  }
}

function buildListQuery(
  firestore: FirebaseFirestore.Firestore,
  input: ListQueryInput,
): FirebaseFirestore.Query {
  let query: FirebaseFirestore.Query = firestore.collection(CLIENT_SUBMISSIONS_COLLECTION);

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

async function listClientSubmissionsWithStatusFallback(
  firestore: FirebaseFirestore.Firestore,
  input: ListQueryInput,
): Promise<{
  items: ClientSubmissionListItemDto[];
  nextCursor: ClientSubmissionCursor | null;
  hasNextPage: boolean;
}> {
  let baseQuery: FirebaseFirestore.Query = firestore.collection(CLIENT_SUBMISSIONS_COLLECTION);

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
    baseQuery = baseQuery.startAfter(
      Timestamp.fromMillis(input.cursor.createdAtMs),
      input.cursor.id,
    );
  }

  const filtered: FirebaseFirestore.QueryDocumentSnapshot[] = [];
  let scanCursor: FirebaseFirestore.QueryDocumentSnapshot | null = null;
  let exhausted = false;

  while (filtered.length < input.limit + 1 && !exhausted) {
    let batchQuery = baseQuery.limit(FALLBACK_SCAN_PAGE_SIZE);
    if (scanCursor) {
      batchQuery = batchQuery.startAfter(scanCursor);
    }

    let batchSnapshot: FirebaseFirestore.QuerySnapshot;
    try {
      batchSnapshot = await batchQuery.get();
    } catch (scanCause) {
      throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to list client submissions', {
        cause: scanCause,
      });
    }

    if (batchSnapshot.empty) {
      exhausted = true;
      break;
    }

    batchSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (isSoftDeleted(data)) return;
      const docStatus = typeof data.status === 'string' ? data.status : 'new';
      if (docStatus === input.status && filtered.length < input.limit + 1) {
        filtered.push(doc);
      }
    });

    scanCursor = batchSnapshot.docs[batchSnapshot.docs.length - 1] ?? null;
    if (batchSnapshot.size < FALLBACK_SCAN_PAGE_SIZE) {
      exhausted = true;
    }
  }

  const hasNextPage = filtered.length > input.limit;
  const pageDocs = hasNextPage ? filtered.slice(0, input.limit) : filtered;
  const items = pageDocs.map(mapDocToListItem);
  const nextCursor =
    hasNextPage && pageDocs.length > 0 ? mapDocToCursor(pageDocs[pageDocs.length - 1]) : null;

  return { items, nextCursor, hasNextPage };
}

export async function listClientSubmissions(input: ListQueryInput): Promise<{
  items: ClientSubmissionListItemDto[];
  nextCursor: ClientSubmissionCursor | null;
  hasNextPage: boolean;
}> {
  const firestore = getFirestoreDb();
  const query = buildListQuery(firestore, input);

  try {
    const filtered: FirebaseFirestore.QueryDocumentSnapshot[] = [];
    let scanCursor: FirebaseFirestore.QueryDocumentSnapshot | null = null;
    let exhausted = false;

    while (filtered.length < input.limit + 1 && !exhausted) {
      let batchQuery = query.limit(FALLBACK_SCAN_PAGE_SIZE);
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
        if (isSoftDeleted(data)) return;
        if (filtered.length < input.limit + 1) {
          filtered.push(doc);
        }
      });

      scanCursor = snapshot.docs[snapshot.docs.length - 1] ?? null;
      if (snapshot.size < FALLBACK_SCAN_PAGE_SIZE) {
        exhausted = true;
      }
    }

    const hasNextPage = filtered.length > input.limit;
    const pageDocs = hasNextPage ? filtered.slice(0, input.limit) : filtered;
    const items = pageDocs.map(mapDocToListItem);
    const nextCursor =
      hasNextPage && pageDocs.length > 0 ? mapDocToCursor(pageDocs[pageDocs.length - 1]) : null;

    return { items, nextCursor, hasNextPage };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    const requiresIndex =
      message.includes('FAILED_PRECONDITION') && message.includes('requires an index');

    if (!requiresIndex || !input.status) {
      throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to list client submissions', {
        cause,
      });
    }

    return listClientSubmissionsWithStatusFallback(firestore, input);
  }
}

export async function getClientSubmissionById(
  submissionId: string,
  options?: { includeDeleted?: boolean },
): Promise<ClientSubmissionRecordDto | null> {
  const firestore = getFirestoreDb();

  let snapshot: FirebaseFirestore.DocumentSnapshot;
  try {
    snapshot = await firestore.collection(CLIENT_SUBMISSIONS_COLLECTION).doc(submissionId).get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load client submission', { cause });
  }

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (!data) {
    throw ApiError.fromCode('INTERNAL_ERROR', 'Client submission payload is missing');
  }

  if (!options?.includeDeleted && isSoftDeleted(data)) {
    return null;
  }

  return mapDocToRecord(snapshot.id, data);
}

export async function updateClientSubmissionStatus(input: {
  submissionId: string;
  status: ClientSubmissionStatus;
  adminUid: string;
}): Promise<{
  updated: UpdateClientSubmissionStatusResponseDto;
  previousStatus: ClientSubmissionStatus;
}> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(CLIENT_SUBMISSIONS_COLLECTION).doc(input.submissionId);

  try {
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw ApiError.fromCode('BAD_REQUEST', `Client submission "${input.submissionId}" not found`);
    }

    const data = snapshot.data();
    if (!data || typeof data.status !== 'string') {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Client submission status is invalid');
    }

    const previousStatus = data.status as ClientSubmissionStatus;

    await docRef.update({
      status: input.status,
      updatedAt: FieldValue.serverTimestamp(),
      reviewedBy: input.adminUid,
      reviewedAt: FieldValue.serverTimestamp(),
    });

    const updatedSnapshot = await docRef.get();
    const updatedData = updatedSnapshot.data();
    if (!updatedData) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Updated client submission payload is missing');
    }

    assertTimestamp(updatedData.updatedAt, `client_submissions/${input.submissionId}.updatedAt`);

    const reviewedAt = updatedData.reviewedAt;
    const reviewedAtIso = reviewedAt instanceof Timestamp ? toIso(reviewedAt) : null;

    return {
      previousStatus,
      updated: {
        id: input.submissionId,
        status: input.status,
        updatedAt: toIso(updatedData.updatedAt),
        reviewedBy: typeof updatedData.reviewedBy === 'string' ? updatedData.reviewedBy : null,
        reviewedAt: reviewedAtIso,
      },
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to update client submission status', {
      cause,
    });
  }
}

export { getClientSubmissionsOverview };

export async function softDeleteClientSubmission(input: {
  submissionId: string;
  adminUid: string;
}): Promise<SoftDeleteClientSubmissionResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(CLIENT_SUBMISSIONS_COLLECTION).doc(input.submissionId);

  try {
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw ApiError.fromCode('BAD_REQUEST', `Client submission "${input.submissionId}" not found`);
    }

    const data = snapshot.data();
    if (!data) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Client submission payload is missing');
    }

    if (isSoftDeleted(data)) {
      throw ApiError.fromCode('BAD_REQUEST', 'Submission is already deleted');
    }

    await docRef.update({
      isDeleted: true,
      deletedAt: FieldValue.serverTimestamp(),
      deletedBy: input.adminUid,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedSnapshot = await docRef.get();
    const updatedData = updatedSnapshot.data();
    if (!updatedData) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Updated client submission payload is missing');
    }

    assertTimestamp(updatedData.updatedAt, `client_submissions/${input.submissionId}.updatedAt`);

    return {
      id: input.submissionId,
      isDeleted: true,
      updatedAt: toIso(updatedData.updatedAt),
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to soft-delete client submission', {
      cause,
    });
  }
}

export async function addClientSubmissionComment(
  input: AddClientSubmissionCommentInput,
): Promise<AddClientSubmissionCommentResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(CLIENT_SUBMISSIONS_COLLECTION).doc(input.submissionId);
  const now = Timestamp.now();

  const commentEntry: ClientSubmissionCommentStored = {
    id: randomUUID(),
    text: input.comment.trim(),
    authorUid: input.adminUid,
    authorEmail: input.adminEmail,
    createdAt: now,
  };

  try {
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw ApiError.fromCode('BAD_REQUEST', `Client submission "${input.submissionId}" not found`);
    }

    await docRef.update({
      comments: FieldValue.arrayUnion(commentEntry),
      updatedAt: FieldValue.serverTimestamp(),
      reviewedBy: input.adminUid,
      reviewedAt: FieldValue.serverTimestamp(),
    });

    const updatedSnapshot = await docRef.get();
    const updatedData = updatedSnapshot.data();
    if (!updatedData) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Updated client submission payload is missing');
    }

    assertTimestamp(updatedData.updatedAt, `client_submissions/${input.submissionId}.updatedAt`);

    return {
      id: input.submissionId,
      comment: {
        id: commentEntry.id,
        text: commentEntry.text,
        authorUid: commentEntry.authorUid,
        authorEmail: commentEntry.authorEmail,
        createdAt: toIso(commentEntry.createdAt),
      },
      updatedAt: toIso(updatedData.updatedAt),
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to add client submission comment', {
      cause,
    });
  }
}

export const clientSubmissionStatusOrder = CLIENT_SUBMISSION_STATUS_ORDER;
