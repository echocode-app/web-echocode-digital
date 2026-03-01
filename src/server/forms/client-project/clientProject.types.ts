import type { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { CLIENT_SUBMISSION_STATUS_VALUES } from '@/shared/admin/constants';

export type ClientSubmissionStatus = (typeof CLIENT_SUBMISSION_STATUS_VALUES)[number];

export const CLIENT_SUBMISSION_STATUSES: readonly ClientSubmissionStatus[] = [
  ...CLIENT_SUBMISSION_STATUS_VALUES,
];

export type ClientProjectImageMetaInput = {
  path: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

export type ClientProjectCreateInput = {
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
  image?: ClientProjectImageMetaInput;
};

export type ClientSubmissionFirestoreDoc = {
  firstName: string;
  lastName: string;
  email: string;
  description: string | null;
  imageUrl?: string;
  imagePath?: string;
  imageName?: string;
  status: ClientSubmissionStatus;
  isDeleted?: boolean;
  deletedAt?: FieldValue;
  deletedBy?: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  reviewedBy?: string;
  reviewedAt?: FieldValue;
  comments?: ClientSubmissionCommentStored[];
};

export type ClientSubmissionCommentStored = {
  id: string;
  text: string;
  authorUid: string;
  authorEmail: string | null;
  createdAt: Timestamp;
};

export type ClientSubmissionCommentDto = {
  id: string;
  text: string;
  authorUid: string;
  authorEmail: string | null;
  createdAt: string;
};

export type ClientSubmissionRecordDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string | null;
  imageUrl: string | null;
  imageName: string | null;
  status: ClientSubmissionStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  comments: ClientSubmissionCommentDto[];
};

export type ClientSubmissionListItemDto = {
  id: string;
  name: string;
  email: string;
  date: string;
  status: ClientSubmissionStatus;
  hasImage: boolean;
  commentsCount: number;
};

export type ClientSubmissionsListResponseDto = {
  items: ClientSubmissionListItemDto[];
  page: {
    limit: number;
    nextCursor: string | null;
    hasNextPage: boolean;
  };
};

export type ClientSubmissionStatusCountsDto = {
  new: number;
  viewed: number;
  processed: number;
  rejected: number;
  deferred: number;
};

export type ClientSubmissionStatusMonthPointDto = {
  month: string;
  new: number;
  viewed: number;
  processed: number;
  rejected: number;
  deferred: number;
};

export type ClientSubmissionsOverviewDto = {
  totals: {
    currentMonth: number;
    allTime: number;
  };
  byStatus: ClientSubmissionStatusCountsDto;
  statusesByMonth: ClientSubmissionStatusMonthPointDto[];
};

export type ClientSubmissionDetailsDto = {
  item: ClientSubmissionRecordDto;
};

export type ClientSubmissionCursor = {
  createdAtMs: number;
  id: string;
};

export type ClientSubmissionListQueryInput = {
  limit: number;
  cursor?: string;
  status?: ClientSubmissionStatus;
  dateFrom?: string;
  dateTo?: string;
};

export type UpdateClientSubmissionStatusInput = {
  submissionId: string;
  status: ClientSubmissionStatus;
  adminUid: string;
};

export type UpdateClientSubmissionStatusResponseDto = {
  id: string;
  status: ClientSubmissionStatus;
  updatedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
};

export type AddClientSubmissionCommentInput = {
  submissionId: string;
  comment: string;
  adminUid: string;
  adminEmail: string | null;
};

export type AddClientSubmissionCommentResponseDto = {
  id: string;
  comment: ClientSubmissionCommentDto;
  updatedAt: string;
};

export type SoftDeleteClientSubmissionResponseDto = {
  id: string;
  isDeleted: true;
  updatedAt: string;
};

export type ClientProjectUploadInitInput = {
  file: {
    originalName: string;
    mimeType: string;
    sizeBytes: number;
  };
};

export type ClientProjectUploadInitResponseDto = {
  uploadUrl: string;
  path: string;
  method: 'PUT';
  expiresAt: string;
  headers: {
    'Content-Type': string;
  };
};

export type CreateClientSubmissionResponseDto = {
  id: string;
  status: ClientSubmissionStatus;
  createdAt: string;
};

export type ClientSubmissionSnapshotLike = {
  id: string;
  data(): Record<string, unknown> | undefined;
  exists: boolean;
};

export type ClientSubmissionTimestamp = Timestamp;
