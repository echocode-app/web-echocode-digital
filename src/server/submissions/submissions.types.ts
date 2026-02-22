import type { FieldValue, Timestamp } from 'firebase-admin/firestore';

export type SubmissionStatusMvp = 'new';
export type SubmissionFormTypeMvp = 'project';

export type SubmissionAttachmentMvp = {
  path: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  kind: 'image' | 'document';
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
  status: SubmissionStatusMvp;
  contact: SubmissionContactMvp;
  content: SubmissionContentMvp;
  attachments: SubmissionAttachmentMvp[];
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type CreateSubmissionRecordInput = {
  formType: SubmissionFormTypeMvp;
  contact: SubmissionContactMvp;
  content: SubmissionContentMvp;
  attachments: SubmissionAttachmentMvp[];
};

export type CreatedSubmissionRecord = {
  id: string;
  formType: SubmissionFormTypeMvp;
  status: SubmissionStatusMvp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CreateSubmissionResponseDto = {
  id: string;
  status: SubmissionStatusMvp;
  createdAt: string;
};

export type CreateProjectSubmissionParams = {
  rawBody: unknown;
};

export type SubmissionListStatus =
  | 'new'
  | 'in_review'
  | 'contacted'
  | 'rejected'
  | 'accepted';

export const SUBMISSION_LIST_STATUSES = [
  'new',
  'in_review',
  'contacted',
  'rejected',
  'accepted',
] as const satisfies readonly SubmissionListStatus[];

export type SubmissionListSortBy = 'createdAt';
export type SubmissionListSortOrder = 'asc' | 'desc';

export type ListSubmissionsQueryInput = {
  page: number;
  limit: number;
  sortBy: SubmissionListSortBy;
  sortOrder: SubmissionListSortOrder;
  status?: SubmissionListStatus;
};

export type SubmissionListItemDto = {
  id: string;
  formType: string;
  status: SubmissionListStatus;
  contact: {
    name: string | null;
    email: string | null;
  };
  hasAttachment: boolean;
  createdAt: string;
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
