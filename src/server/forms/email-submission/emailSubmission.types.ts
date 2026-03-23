import type { FieldValue } from 'firebase-admin/firestore';
import type {
  ModerationCommentDto,
  ModerationActorProfileDto,
  ModerationCommentStored,
  ModerationCursor,
  ModerationListQueryInput,
  ModerationStatus,
  ModerationStatusCountsDto,
  ModerationStatusMonthPointDto,
  UpdateModerationStatusResponseDto,
} from '@/server/forms/shared/moderation.types';

export type EmailSubmissionCreateInput = {
  email: string;
  source?: string;
};

export type EmailSubmissionStatus = ModerationStatus;

export type EmailSubmissionFirestoreDoc = {
  email: string;
  source: string;
  status: ModerationStatus;
  isDeleted?: boolean;
  deletedAt?: FieldValue;
  deletedBy?: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  reviewedBy?: string;
  reviewedAt?: FieldValue;
  comments?: ModerationCommentStored[];
};

export type EmailSubmissionRecordDto = {
  id: string;
  email: string;
  source: string;
  status: ModerationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy: string | null;
  reviewedByProfile: ModerationActorProfileDto | null;
  reviewedAt: string | null;
  comments: ModerationCommentDto[];
};

export type EmailSubmissionListItemDto = {
  id: string;
  email: string;
  source: string;
  date: string;
  status: ModerationStatus;
  commentsCount: number;
};

export type EmailSubmissionsListResponseDto = {
  items: EmailSubmissionListItemDto[];
  page: {
    limit: number;
    nextCursor: string | null;
    hasNextPage: boolean;
  };
};

export type EmailSubmissionsOverviewDto = {
  totals: {
    currentMonth: number;
    allTime: number;
  };
  byStatus: ModerationStatusCountsDto;
  statusesByMonth: ModerationStatusMonthPointDto[];
};

export type EmailSubmissionDetailsDto = {
  item: EmailSubmissionRecordDto;
};

export type EmailSubmissionCursor = ModerationCursor;
export type EmailSubmissionListQueryInput = ModerationListQueryInput;

export type UpdateEmailSubmissionStatusInput = {
  submissionId: string;
  status: ModerationStatus;
  adminUid: string;
};

export type UpdateEmailSubmissionStatusResponseDto = UpdateModerationStatusResponseDto;

export type AddEmailSubmissionCommentInput = {
  submissionId: string;
  comment: string;
  adminUid: string;
  adminEmail: string | null;
};

export type AddEmailSubmissionCommentResponseDto = {
  id: string;
  comment: ModerationCommentDto;
  updatedAt: string;
};

export type SoftDeleteEmailSubmissionResponseDto = {
  id: string;
  isDeleted: true;
  updatedAt: string;
};

export type CreateEmailSubmissionResponseDto = {
  id: string;
  status: ModerationStatus;
  createdAt: string;
};
