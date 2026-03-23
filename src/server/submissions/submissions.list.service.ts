import { z } from 'zod';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';
import { SITE_IDS } from '@/server/sites/siteContext';
import { toSubmissionListItemDto } from '@/server/submissions/submissions.mapper';
import { SUBMISSION_LIST_STATUSES } from '@/server/submissions/submissions.types';
import type {
  ListSubmissionsQueryInput,
  ListSubmissionsResponseDto,
  SubmissionListSortOrder,
  SubmissionListStatus,
} from '@/server/submissions/submissions.types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const submissionStatusSchema = z.enum(SUBMISSION_LIST_STATUSES);

export const listSubmissionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
  sortBy: z.literal('createdAt').default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: submissionStatusSchema.optional(),
  siteId: z.enum(SITE_IDS).optional(),
});

type ListSubmissionsParams = {
  query: ListSubmissionsQueryInput;
};

function ensureValidTotalCount(value: unknown): number {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) return value;

  throw ApiError.fromCode(
    'INTERNAL_ERROR',
    'Invalid Firestore count() result for submissions list',
  );
}

function buildSubmissionsBaseQuery(status?: SubmissionListStatus, siteId?: string) {
  const firestore = getFirestoreDb();
  let query: FirebaseFirestore.Query = firestore.collection('submissions');

  // Keep filter set minimal and index-backed for admin table reads.
  if (status) {
    query = query.where('status', '==', status);
  }

  if (siteId) {
    query = query.where('siteId', '==', siteId);
  }

  return query;
}

function toFirestoreSortDirection(
  sortOrder: SubmissionListSortOrder,
): FirebaseFirestore.OrderByDirection {
  return sortOrder;
}

export async function listSubmissions(
  params: ListSubmissionsParams,
): Promise<ListSubmissionsResponseDto> {
  const query = params.query;
  const offset = (query.page - 1) * query.limit;

  const baseQuery = buildSubmissionsBaseQuery(query.status, query.siteId);

  let total: number;
  try {
    // count() keeps pagination meta accurate without loading page data twice.
    const countSnapshot = await baseQuery.count().get();
    total = ensureValidTotalCount(countSnapshot.data().count);
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode(
      'FIREBASE_UNAVAILABLE',
      'Failed to count submissions for admin list',
      { cause },
    );
  }

  let querySnapshot: FirebaseFirestore.QuerySnapshot;
  try {
    // Offset pagination is an explicit admin-panel tradeoff for this MVP list endpoint.
    querySnapshot = await baseQuery
      .orderBy(query.sortBy, toFirestoreSortDirection(query.sortOrder))
      .offset(offset)
      .limit(query.limit)
      .get();
  } catch (cause) {
    throw ApiError.fromCode(
      'FIREBASE_UNAVAILABLE',
      'Failed to load submissions list from Firestore',
      { cause },
    );
  }

  const items = querySnapshot.docs.map(toSubmissionListItemDto);
  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

  return {
    items,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  };
}
