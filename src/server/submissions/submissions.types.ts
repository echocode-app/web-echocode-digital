import type { FieldValue, Timestamp } from 'firebase-admin/firestore';
import type {
  ModerationActorProfileDto,
  ModerationCommentDto,
  ModerationCommentStored,
} from '@/server/forms/shared/moderation.types';
import type { SiteId } from '@/server/sites/siteContext';

export type SubmissionWorkflowStatus =
  | 'new'
  | 'viewed'
  | 'processed'
  | 'rejected'
  | 'deferred';
export type SubmissionFormTypeMvp = 'project';

export type SubmissionAttachmentMvp = {
  path: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  kind: 'image' | 'document';
  url?: string | null;
};

export type SubmissionContactMvp = {
  email: string;
  name: string;
};

export type SubmissionContentMvp = {
  message: string | null;
  profileUrl: null;
};

export type SubmissionFirestoreDocMvp = {
  formType: SubmissionFormTypeMvp;
  status: SubmissionWorkflowStatus;
  siteId: SiteId;
  siteHost: string;
  source: string;
  contact: SubmissionContactMvp;
  content: SubmissionContentMvp;
  attachments: SubmissionAttachmentMvp[];
  deletedAt?: FieldValue;
  deletedBy?: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  updatedBy?: string;
  reviewedBy?: string;
  reviewedAt?: FieldValue;
  comments?: ModerationCommentStored[];
};

export type CreateSubmissionRecordInput = {
  formType: SubmissionFormTypeMvp;
  siteId: SiteId;
  siteHost: string;
  source: string;
  contact: SubmissionContactMvp;
  content: SubmissionContentMvp;
  attachments: SubmissionAttachmentMvp[];
};

export type CreatedSubmissionRecord = {
  id: string;
  formType: SubmissionFormTypeMvp;
  status: SubmissionWorkflowStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CreateSubmissionResponseDto = {
  id: string;
  status: SubmissionWorkflowStatus;
  createdAt: string;
};

export type CreateProjectSubmissionParams = {
  rawBody: unknown;
  requestHeaders?: Headers;
};

export type SubmissionListStatus = SubmissionWorkflowStatus;

export const SUBMISSION_LIST_STATUSES = [
  'new',
  'viewed',
  'processed',
  'rejected',
  'deferred',
] as const satisfies readonly SubmissionListStatus[];

export type SubmissionListSortBy = 'createdAt';
export type SubmissionListSortOrder = 'asc' | 'desc';

export type ListSubmissionsQueryInput = {
  page: number;
  limit: number;
  sortBy: SubmissionListSortBy;
  sortOrder: SubmissionListSortOrder;
  status?: SubmissionListStatus;
  siteId?: SiteId;
};

export type SubmissionListItemDto = {
  id: string;
  formType: string;
  status: SubmissionListStatus;
  siteId: SiteId | null;
  siteHost: string | null;
  source: string | null;
  contact: {
    name: string | null;
    email: string | null;
  };
  hasAttachment: boolean;
  commentsCount: number;
  createdAt: string;
};

export type SubmissionRecordDto = {
  id: string;
  formType: SubmissionFormTypeMvp;
  status: SubmissionWorkflowStatus;
  siteId: SiteId | null;
  siteHost: string | null;
  source: string | null;
  contact: SubmissionContactMvp;
  content: SubmissionContentMvp;
  attachments: SubmissionAttachmentMvp[];
  createdAt: string;
  updatedAt: string;
  reviewedBy: string | null;
  reviewedByProfile: ModerationActorProfileDto | null;
  reviewedAt: string | null;
  comments: ModerationCommentDto[];
};

export type SubmissionDetailsDto = {
  item: SubmissionRecordDto;
};

export type ListSubmissionsResponseDto = {
  items: SubmissionListItemDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UpdateSubmissionStatusInput = {
  submissionId: string;
  status: SubmissionWorkflowStatus;
  updatedBy: string;
};

export type UpdateSubmissionStatusResponseDto = {
  id: string;
  status: SubmissionWorkflowStatus;
  updatedAt: string;
  updatedBy: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
};

export type SubmissionCommentDto = ModerationCommentDto;

export type AddSubmissionCommentInput = {
  submissionId: string;
  comment: string;
  adminUid: string;
  adminEmail: string | null;
};

export type AddSubmissionCommentResponseDto = {
  id: string;
  comment: SubmissionCommentDto;
  updatedAt: string;
};

export type SoftDeleteSubmissionInput = {
  submissionId: string;
  adminUid: string;
};

export type SoftDeleteSubmissionResponseDto = {
  id: string;
  isDeleted: true;
  updatedAt: string;
};

export type SubmissionCursor = {
  createdAtMs: number;
  id: string;
};

export type EchocodeAppSubmissionListQueryInput = {
  limit: number;
  cursor?: string;
  status?: SubmissionListStatus;
  dateFrom?: string;
  dateTo?: string;
  siteId: SiteId;
};

export type EchocodeAppSubmissionsListResponseDto = {
  items: SubmissionListItemDto[];
  page: {
    limit: number;
    nextCursor: string | null;
    hasNextPage: boolean;
  };
};
