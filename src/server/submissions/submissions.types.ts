import type { FieldValue, Timestamp } from 'firebase-admin/firestore';

export type SubmissionWorkflowStatus =
  | 'new'
  | 'in_review'
  | 'contacted'
  | 'rejected'
  | 'closed';
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
  status: SubmissionWorkflowStatus;
  contact: SubmissionContactMvp;
  content: SubmissionContentMvp;
  attachments: SubmissionAttachmentMvp[];
  createdAt: FieldValue;
  updatedAt: FieldValue;
  updatedBy?: string;
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
  'in_review',
  'contacted',
  'rejected',
  'closed',
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
};
