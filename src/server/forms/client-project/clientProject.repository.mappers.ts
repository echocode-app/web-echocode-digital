import { Timestamp } from 'firebase-admin/firestore';
import type {
  ClientSubmissionCommentDto,
  ClientSubmissionCommentStored,
  ClientSubmissionCursor,
  ClientSubmissionListItemDto,
  ClientSubmissionRecordDto,
  ClientSubmissionStatus,
} from '@/server/forms/client-project/clientProject.types';
import { assertTimestamp, toIso } from '@/server/forms/client-project/clientProject.repository.shared';

export function mapDocToRecord(id: string, data: Record<string, unknown>): ClientSubmissionRecordDto {
  assertTimestamp(data.createdAt, `client_submissions/${id}.createdAt`);
  assertTimestamp(data.updatedAt, `client_submissions/${id}.updatedAt`);

  const reviewedAt = data.reviewedAt;
  const reviewedAtIso = reviewedAt instanceof Timestamp ? toIso(reviewedAt) : null;

  const rawComments = Array.isArray(data.comments) ? data.comments : [];
  const comments = rawComments
    .map((entry): ClientSubmissionCommentDto | null => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null;
      const comment = entry as Partial<ClientSubmissionCommentStored>;
      if (!(comment.createdAt instanceof Timestamp) || typeof comment.id !== 'string' || typeof comment.text !== 'string') {
        return null;
      }

      return {
        id: comment.id,
        text: comment.text,
        authorUid: typeof comment.authorUid === 'string' ? comment.authorUid : 'unknown',
        authorEmail: typeof comment.authorEmail === 'string' ? comment.authorEmail : null,
        createdAt: toIso(comment.createdAt),
      };
    })
    .filter((entry): entry is ClientSubmissionCommentDto => entry !== null)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return {
    id,
    firstName: typeof data.firstName === 'string' ? data.firstName : '',
    lastName: typeof data.lastName === 'string' ? data.lastName : '',
    email: typeof data.email === 'string' ? data.email : '',
    description: typeof data.description === 'string' ? data.description : null,
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : null,
    imageName: typeof data.imageName === 'string' ? data.imageName : null,
    status: typeof data.status === 'string' ? (data.status as ClientSubmissionStatus) : 'new',
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    reviewedBy: typeof data.reviewedBy === 'string' ? data.reviewedBy : null,
    reviewedAt: reviewedAtIso,
    comments,
  };
}

export function mapDocToListItem(doc: FirebaseFirestore.QueryDocumentSnapshot): ClientSubmissionListItemDto {
  const data = doc.data();
  assertTimestamp(data.createdAt, `client_submissions/${doc.id}.createdAt`);

  const firstName = typeof data.firstName === 'string' ? data.firstName : '';
  const lastName = typeof data.lastName === 'string' ? data.lastName : '';
  const commentsCount = Array.isArray(data.comments) ? data.comments.length : 0;

  return {
    id: doc.id,
    name: `${firstName} ${lastName}`.trim(),
    email: typeof data.email === 'string' ? data.email : '',
    date: toIso(data.createdAt),
    status: typeof data.status === 'string' ? (data.status as ClientSubmissionStatus) : 'new',
    hasImage: typeof data.imageUrl === 'string' && data.imageUrl.length > 0,
    commentsCount: Number.isFinite(commentsCount) && commentsCount > 0 ? Math.trunc(commentsCount) : 0,
  };
}

export function mapDocToCursor(doc: FirebaseFirestore.QueryDocumentSnapshot): ClientSubmissionCursor {
  const createdAt = doc.data().createdAt;
  assertTimestamp(createdAt, `client_submissions/${doc.id}.createdAt`);
  return { createdAtMs: createdAt.toMillis(), id: doc.id };
}
