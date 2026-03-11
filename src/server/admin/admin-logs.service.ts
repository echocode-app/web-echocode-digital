import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { env } from '@/server/config/env';
import { getFirestoreDb } from '@/server/firebase/firestore';
import { ApiError } from '@/server/lib/errors';

export type AdminActionType =
  | 'submissions.status.update'
  | 'submissions.comment.add'
  | 'submissions.soft_delete'
  | 'client_submission.status_update'
  | 'client_submission.comment_add'
  | 'client_submission.soft_delete'
  | 'email_submission.status_update'
  | 'email_submission.comment_add'
  | 'email_submission.soft_delete'
  | 'vacancy_submission.status_update'
  | 'vacancy_submission.comment_add'
  | 'vacancy_submission.soft_delete'
  | 'portfolio.manage'
  | 'vacancies.manage'
  | 'admin.login';

export type AdminEntityType =
  | 'submission'
  | 'client_submission'
  | 'email_submission'
  | 'vacancy_submission'
  | 'portfolio'
  | 'vacancy'
  | 'auth';

type AdminLogDoc = {
  adminUid: string;
  actionType: AdminActionType;
  entityType: AdminEntityType;
  entityId: string;
  metadata: Record<string, unknown>;
  timestamp: FieldValue;
};

export type CreateAdminActionLogInput = {
  adminUid: string;
  actionType: AdminActionType;
  entityType: AdminEntityType;
  entityId: string;
  metadata?: Record<string, unknown>;
};

export type AdminLogItemDto = {
  id: string;
  adminUid: string;
  actionType: AdminActionType;
  entityType: AdminEntityType;
  entityId: string;
  metadata: Record<string, unknown>;
  timestamp: string;
};

export type AdminLogListResponseDto = {
  items: AdminLogItemDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const listAdminLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  actionType: z.string().trim().min(1).optional(),
  entityType: z.string().trim().min(1).optional(),
});

export type ListAdminLogsQueryInput = z.infer<typeof listAdminLogsQuerySchema>;

function sanitizeMetadata(metadata: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!metadata) return {};

  const blocked = ['token', 'authorization', 'password', 'secret', 'cookie'];
  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    const normalized = key.toLowerCase();
    if (blocked.some((item) => normalized.includes(item))) {
      output[key] = '[REDACTED]';
      continue;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      output[key] = value;
      continue;
    }

    if (value == null) {
      output[key] = null;
      continue;
    }

    output[key] = '[FILTERED]';
  }

  return output;
}

export async function logAdminAction(input: CreateAdminActionLogInput): Promise<void> {
  const payload: AdminLogDoc = {
    adminUid: input.adminUid,
    actionType: input.actionType,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: sanitizeMetadata(input.metadata),
    timestamp: FieldValue.serverTimestamp(),
  };

  try {
    await getFirestoreDb().collection('admin_logs').add(payload);

    if (env.nodeEnv === 'development') {
      process.stdout.write(
        `${JSON.stringify({
          level: 'info',
          message: 'admin_action_log',
          ...payload,
          timestamp: new Date().toISOString(),
        })}\n`,
      );
    }
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to write admin action log', { cause });
  }
}

function assertTimestamp(value: unknown, docId: string): asserts value is Timestamp {
  if (!(value instanceof Timestamp)) {
    throw ApiError.fromCode('INTERNAL_ERROR', `Admin log "${docId}" has invalid timestamp`);
  }
}

export async function listAdminLogs(
  query: ListAdminLogsQueryInput,
): Promise<AdminLogListResponseDto> {
  const firestore = getFirestoreDb();
  let baseQuery: FirebaseFirestore.Query = firestore.collection('admin_logs');

  if (query.actionType) {
    baseQuery = baseQuery.where('actionType', '==', query.actionType);
  }

  if (query.entityType) {
    baseQuery = baseQuery.where('entityType', '==', query.entityType);
  }

  const offset = (query.page - 1) * query.limit;

  let total: number;
  try {
    const countSnapshot = await baseQuery.count().get();
    const count = countSnapshot.data().count;
    if (!Number.isSafeInteger(count) || count < 0) {
      throw ApiError.fromCode('INTERNAL_ERROR', 'Invalid admin logs count result');
    }
    total = count;
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to count admin logs', { cause });
  }

  let snapshot: FirebaseFirestore.QuerySnapshot;
  try {
    snapshot = await baseQuery.orderBy('timestamp', 'desc').offset(offset).limit(query.limit).get();
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to list admin logs', { cause });
  }

  const items = snapshot.docs.map((doc) => {
    const data = doc.data();
    assertTimestamp(data.timestamp, doc.id);

    return {
      id: doc.id,
      adminUid: typeof data.adminUid === 'string' ? data.adminUid : 'unknown',
      actionType: typeof data.actionType === 'string' ? (data.actionType as AdminActionType) : 'admin.login',
      entityType: typeof data.entityType === 'string' ? (data.entityType as AdminEntityType) : 'auth',
      entityId: typeof data.entityId === 'string' ? data.entityId : 'unknown',
      metadata:
        data.metadata && typeof data.metadata === 'object' && !Array.isArray(data.metadata)
          ? (data.metadata as Record<string, unknown>)
          : {},
      timestamp: data.timestamp.toDate().toISOString(),
    } as AdminLogItemDto;
  });

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
