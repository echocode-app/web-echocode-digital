import type { FieldValue } from 'firebase-admin/firestore';
import type {
  ModerationCommentDto,
  ModerationCommentStored,
  ModerationCursor,
  ModerationListQueryInput,
  ModerationStatus,
  ModerationStatusCountsDto,
  ModerationStatusMonthPointDto,
  UpdateModerationStatusResponseDto,
} from '@/server/forms/shared/moderation.types';
import type { VacancySubmissionContextSnapshot } from '@/server/vacancies';

export type VacancySubmissionCvInput = {
  path: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

export type VacancySubmissionCreateInput = {
  profileUrl: string;
  cvFile: VacancySubmissionCvInput;
  vacancy: VacancySubmissionContextSnapshot;
};

export type VacancySubmissionStatus = ModerationStatus;

export type VacancySubmissionFirestoreDoc = {
  profileUrl: string;
  cvPath: string;
  cvName: string;
  cvMimeType: string;
  cvSizeBytes: number;
  vacancy: VacancySubmissionContextSnapshot;
  vacancyKey: string;
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

export type VacancySubmissionRecordDto = {
  id: string;
  profileUrl: string;
  cvFile: VacancySubmissionCvInput;
  vacancy: VacancySubmissionContextSnapshot;
  vacancyKey: string;
  status: ModerationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  comments: ModerationCommentDto[];
};

export type VacancySubmissionListItemDto = {
  id: string;
  profileUrl: string;
  cvName: string;
  vacancy: VacancySubmissionContextSnapshot;
  vacancyKey: string;
  date: string;
  status: ModerationStatus;
  commentsCount: number;
};

export type VacancySubmissionsListResponseDto = {
  items: VacancySubmissionListItemDto[];
  page: {
    limit: number;
    nextCursor: string | null;
    hasNextPage: boolean;
  };
};

export type VacancySubmissionVacancyGroupDto = {
  vacancyKey: string;
  vacancy: VacancySubmissionContextSnapshot;
  submissionsTotal: number;
  newCount: number;
  latestSubmissionAt: string | null;
};

export type VacancySubmissionsOverviewDto = {
  totals: {
    currentMonth: number;
    allTime: number;
  };
  byStatus: ModerationStatusCountsDto;
  statusesByMonth: ModerationStatusMonthPointDto[];
  byVacancy: VacancySubmissionVacancyGroupDto[];
};

export type VacancySubmissionDetailsDto = {
  item: VacancySubmissionRecordDto;
};

export type VacancySubmissionCursor = ModerationCursor;

export type VacancySubmissionListQueryInput = ModerationListQueryInput & {
  vacancyKey?: string;
};

export type UpdateVacancySubmissionStatusInput = {
  submissionId: string;
  status: ModerationStatus;
  adminUid: string;
};

export type UpdateVacancySubmissionStatusResponseDto = UpdateModerationStatusResponseDto;

export type AddVacancySubmissionCommentInput = {
  submissionId: string;
  comment: string;
  adminUid: string;
  adminEmail: string | null;
};

export type AddVacancySubmissionCommentResponseDto = {
  id: string;
  comment: ModerationCommentDto;
  updatedAt: string;
};

export type SoftDeleteVacancySubmissionResponseDto = {
  id: string;
  isDeleted: true;
  updatedAt: string;
};

export type CreateVacancySubmissionResponseDto = {
  id: string;
  status: ModerationStatus;
  createdAt: string;
};
