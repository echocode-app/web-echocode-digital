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
  requestId?: string;
};
