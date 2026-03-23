import type {
  EmailSubmissionDetailsDto as ServerEmailSubmissionDetailsDto,
  EmailSubmissionListItemDto as ServerEmailSubmissionListItemDto,
  EmailSubmissionsListResponseDto as ServerEmailSubmissionsListResponseDto,
} from '@/server/forms/email-submission/emailSubmission.types';

export type EmailSubmissionListItemDto = ServerEmailSubmissionListItemDto;
export type EmailSubmissionsListResponseDto = ServerEmailSubmissionsListResponseDto;
export type EmailSubmissionDetailsDto = ServerEmailSubmissionDetailsDto;
export type EmailSubmissionDetailsItemDto = EmailSubmissionDetailsDto['item'];

export type LoadState = 'loading' | 'ready' | 'error';
