import type { Timestamp } from 'firebase-admin/firestore';
import { CLIENT_SUBMISSION_STATUS_VALUES } from '@/shared/admin/constants';

export type ModerationStatus = (typeof CLIENT_SUBMISSION_STATUS_VALUES)[number];

export const MODERATION_STATUSES: readonly ModerationStatus[] = [
  ...CLIENT_SUBMISSION_STATUS_VALUES,
];

export type ModerationCommentStored = {
  id: string;
  text: string;
  authorUid: string;
  authorEmail: string | null;
  createdAt: Timestamp;
};

export type ModerationCommentDto = {
  id: string;
  text: string;
  authorUid: string;
  authorEmail: string | null;
  authorProfile?: ModerationActorProfileDto | null;
  createdAt: string;
};

export type ModerationActorProfileDto = {
  uid: string;
  displayName: string | null;
  roleLabel: string | null;
  email: string | null;
};

export type ModerationStatusCountsDto = {
  new: number;
  viewed: number;
  processed: number;
  rejected: number;
  deferred: number;
};

export type ModerationStatusMonthPointDto = {
  month: string;
  new: number;
  viewed: number;
  processed: number;
  rejected: number;
  deferred: number;
};

export type ModerationCursor = {
  createdAtMs: number;
  id: string;
};

export type ModerationListQueryInput = {
  limit: number;
  cursor?: string;
  status?: ModerationStatus;
  dateFrom?: string;
  dateTo?: string;
};

export type UpdateModerationStatusResponseDto = {
  id: string;
  status: ModerationStatus;
  updatedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
};
