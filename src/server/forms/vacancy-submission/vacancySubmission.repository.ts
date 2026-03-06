import { FieldPath, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { randomUUID } from 'node:crypto';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import {
  assertTimestamp,
  isSoftDeleted,
  MODERATION_SCAN_PAGE_SIZE,
  toIso,
  toModerationStatus,
} from '@/server/forms/shared/moderation.repository';
import {
  mapVacancySubmissionDocToCursor,
  mapVacancySubmissionDocToListItem,
  mapVacancySubmissionDocToRecord,
} from '@/server/forms/vacancy-submission/vacancySubmission.repository.mappers';
import { getVacancySubmissionsOverview } from '@/server/forms/vacancy-submission/vacancySubmission.repository.overview';
import {
  mapVacancySnapshot,
  toVacancyKey,
  VACANCY_SUBMISSIONS_COLLECTION,
} from '@/server/forms/vacancy-submission/vacancySubmission.repository.shared';
import type {
  AddVacancySubmissionCommentInput,
  AddVacancySubmissionCommentResponseDto,
  CreateVacancySubmissionResponseDto,
  SoftDeleteVacancySubmissionResponseDto,
  UpdateVacancySubmissionStatusResponseDto,
  VacancySubmissionCreateInput,
  VacancySubmissionCursor,
  VacancySubmissionListItemDto,
  VacancySubmissionRecordDto,
  VacancySubmissionStatus,
} from '@/server/forms/vacancy-submission/vacancySubmission.types';

type ListQueryInput = {
  limit: number;
  status?: VacancySubmissionStatus;
  vacancyKey?: string;
  dateFrom?: string;
  dateTo?: string;
  cursor?: VacancySubmissionCursor;
};

export async function createVacancySubmissionRecord(input: {
  payload: VacancySubmissionCreateInput;
}): Promise<CreateVacancySubmissionResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(VACANCY_SUBMISSIONS_COLLECTION).doc();
  const vacancyKey = toVacancyKey(input.payload.vacancy);

  const doc = {
    profileUrl: input.payload.profileUrl,
    cvPath: input.payload.cvFile.path,
    cvName: input.payload.cvFile.originalName,
    cvMimeType: input.payload.cvFile.mimeType,
    cvSizeBytes: input.payload.cvFile.sizeBytes,
    vacancy: input.payload.vacancy,
    vacancyKey,
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
      throw ApiError.fromCode('INTERNAL_ERROR', 'Failed to read created vacancy submission');
    }

    assertTimestamp(data.createdAt, `vacancy_submissions/${docRef.id}.createdAt`);

    return {
      id: docRef.id,
      status: 'new',
      createdAt: toIso(data.createdAt),
    };
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to create vacancy submission', { cause });
  }
}

function buildListQuery(firestore: FirebaseFirestore.Firestore, input: ListQueryInput): FirebaseFirestore.Query {
  let query: FirebaseFirestore.Query = firestore.collection(VACANCY_SUBMISSIONS_COLLECTION);

  if (input.status) {
    query = query.where('status', '==', input.status);
  }

  if (input.vacancyKey) {
    query = query.where('vacancyKey', '==', input.vacancyKey);
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

function matchesFallbackFilters(data: Record<string, unknown>, input: ListQueryInput): boolean {
  if (isSoftDeleted(data)) return false;

  if (input.status && toModerationStatus(data.status) !== input.status) {
    return false;
  }

  if (input.vacancyKey) {
    // Rebuild key from snapshot when historical docs do not have precomputed vacancyKey.
    const vacancy = mapVacancySnapshot(data);
    const docVacancyKey = typeof data.vacancyKey === 'string' ? data.vacancyKey : toVacancyKey(vacancy);
    if (docVacancyKey !== input.vacancyKey) {
      return false;
    }
  }

  return true;
}

async function listWithFallback(
  firestore: FirebaseFirestore.Firestore,
  input: ListQueryInput,
): Promise<{ items: VacancySubmissionListItemDto[]; nextCursor: VacancySubmissionCursor | null; hasNextPage: boolean }> {
  let baseQuery: FirebaseFirestore.Query = firestore.collection(VACANCY_SUBMISSIONS_COLLECTION);

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

  // Fallback path handles missing composite indexes (status/date or vacancyKey/date).
  while (filtered.length < input.limit + 1 && !exhausted) {
    let batchQuery = baseQuery.limit(MODERATION_SCAN_PAGE_SIZE);
    if (scanCursor) {
      batchQuery = batchQuery.startAfter(scanCursor);
    }

    let batchSnapshot: FirebaseFirestore.QuerySnapshot;
    try {
      batchSnapshot = await batchQuery.get();
    } catch (scanCause) {
      throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to list vacancy submissions', { cause: scanCause });
    }

    if (batchSnapshot.empty) {
      exhausted = true;
      break;
    }

    batchSnapshot.docs.forEach((doc) => {
      if (!matchesFallbackFilters(doc.data(), input)) return;
      if (filtered.length < input.limit + 1) {
        filtered.push(doc);
      }
    });

    scanCursor = batchSnapshot.docs[batchSnapshot.docs.length - 1] ?? null;
    if (batchSnapshot.size < MODERATION_SCAN_PAGE_SIZE) {
      exhausted = true;
    }
  }

  const hasNextPage = filtered.length > input.limit;
  const pageDocs = hasNextPage ? filtered.slice(0, input.limit) : filtered;
  const items = pageDocs.map(mapVacancySubmissionDocToListItem);
  const nextCursor = hasNextPage && pageDocs.length > 0
    ? mapVacancySubmissionDocToCursor(pageDocs[pageDocs.length - 1])
    : null;

  return { items, nextCursor, hasNextPage };
}

export async function listVacancySubmissions(input: ListQueryInput): Promise<{
  items: VacancySubmissionListItemDto[];
  nextCursor: VacancySubmissionCursor | null;
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
        if (isSoftDeleted(data)) return;
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
    const items = pageDocs.map(mapVacancySubmissionDocToListItem);
    const nextCursor = hasNextPage && pageDocs.length > 0
      ? mapVacancySubmissionDocToCursor(pageDocs[pageDocs.length - 1])
      : null;

    return { items, nextCursor, hasNextPage };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    const requiresIndex = message.includes('FAILED_PRECONDITION') && message.includes('requires an index');

    if (!requiresIndex || (!input.status && !input.vacancyKey)) {
      throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to list vacancy submissions', { cause });
    }

    return listWithFallback(firestore, input);
  }
}

export async function getVacancySubmissionById(
  submissionId: string,
  options?: { includeDeleted?: boolean },
): Promise<VacancySubmissionRecordDto | null> {
  const firestore = getFirestoreDb();

  let snapshot: FirebaseFirestore.DocumentSnapshot;
  try {
    snapshot = await firestore.collection(VACANCY_SUBMISSIONS_COLLECTION).doc(submissionId).get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to load vacancy submission', { cause });
  }

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data();
  if (!data) {
    throw ApiError.fromCode('INTERNAL_ERROR', `Vacancy submission "${submissionId}" payload is missing`);
  }

  if (!options?.includeDeleted && isSoftDeleted(data)) {
    return null;
  }

  return mapVacancySubmissionDocToRecord(snapshot.id, data);
}

export async function updateVacancySubmissionStatus(input: {
  submissionId: string;
  status: VacancySubmissionStatus;
  adminUid: string;
}): Promise<{ previousStatus: VacancySubmissionStatus; updated: UpdateVacancySubmissionStatusResponseDto }> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(VACANCY_SUBMISSIONS_COLLECTION).doc(input.submissionId);

  try {
    return await firestore.runTransaction(async (tx) => {
      const snapshot = await tx.get(docRef);
      if (!snapshot.exists) {
        throw ApiError.fromCode('BAD_REQUEST', `Vacancy submission "${input.submissionId}" not found`);
      }

      const data = snapshot.data();
      if (!data || isSoftDeleted(data)) {
        throw ApiError.fromCode('BAD_REQUEST', `Vacancy submission "${input.submissionId}" not found`);
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
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to update vacancy submission status', { cause });
  }
}

export async function addVacancySubmissionComment(
  input: AddVacancySubmissionCommentInput,
): Promise<AddVacancySubmissionCommentResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(VACANCY_SUBMISSIONS_COLLECTION).doc(input.submissionId);
  const commentId = randomUUID();

  try {
    return await firestore.runTransaction(async (tx) => {
      const snapshot = await tx.get(docRef);
      if (!snapshot.exists) {
        throw ApiError.fromCode('BAD_REQUEST', `Vacancy submission "${input.submissionId}" not found`);
      }

      const data = snapshot.data();
      if (!data || isSoftDeleted(data)) {
        throw ApiError.fromCode('BAD_REQUEST', `Vacancy submission "${input.submissionId}" not found`);
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
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to add vacancy submission comment', { cause });
  }
}

export async function softDeleteVacancySubmission(input: {
  submissionId: string;
  adminUid: string;
}): Promise<SoftDeleteVacancySubmissionResponseDto> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(VACANCY_SUBMISSIONS_COLLECTION).doc(input.submissionId);

  try {
    return await firestore.runTransaction(async (tx) => {
      const snapshot = await tx.get(docRef);
      if (!snapshot.exists) {
        throw ApiError.fromCode('BAD_REQUEST', `Vacancy submission "${input.submissionId}" not found`);
      }

      const data = snapshot.data();
      if (!data || isSoftDeleted(data)) {
        throw ApiError.fromCode('BAD_REQUEST', `Vacancy submission "${input.submissionId}" not found`);
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
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to delete vacancy submission', { cause });
  }
}

export { toVacancyKey };
export { getVacancySubmissionsOverview };
