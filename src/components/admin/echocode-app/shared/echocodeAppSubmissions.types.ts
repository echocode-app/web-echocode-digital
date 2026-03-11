import type {
  EchocodeAppSubmissionDetailsDto as ServerEchocodeAppSubmissionDetailsDto,
  EchocodeAppSubmissionsDto as ServerEchocodeAppSubmissionsDto,
} from '@/server/admin/echocode-app';

export type EchocodeAppSubmissionsDto = ServerEchocodeAppSubmissionsDto;
export type EchocodeAppSubmissionListItemDto = EchocodeAppSubmissionsDto['items'][number];
export type EchocodeAppSubmissionDetailsDto = ServerEchocodeAppSubmissionDetailsDto;
export type EchocodeAppSubmissionDetailsItemDto = EchocodeAppSubmissionDetailsDto['item'];

export type LoadState = 'loading' | 'ready' | 'error';
