import type {
  ClientSubmissionDetailsDto as ServerClientSubmissionDetailsDto,
  ClientSubmissionListItemDto as ServerClientSubmissionListItemDto,
  ClientSubmissionsListResponseDto as ServerClientSubmissionsListResponseDto,
} from '@/server/forms/client-project/clientProject.types';

export type ClientSubmissionListItemDto = ServerClientSubmissionListItemDto;
export type ClientSubmissionsListResponseDto = ServerClientSubmissionsListResponseDto;
export type ClientSubmissionDetailsDto = ServerClientSubmissionDetailsDto;
export type ClientSubmissionDetailsItemDto = ClientSubmissionDetailsDto['item'];

export type LoadState = 'loading' | 'ready' | 'error';
