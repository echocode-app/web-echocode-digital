import type {
  VacancySubmissionDetailsDto as ServerVacancySubmissionDetailsDto,
  VacancySubmissionListItemDto as ServerVacancySubmissionListItemDto,
  VacancySubmissionsListResponseDto as ServerVacancySubmissionsListResponseDto,
} from '@/server/forms/vacancy-submission/vacancySubmission.types';

export type VacancyCandidateListItemDto = ServerVacancySubmissionListItemDto;
export type VacancyCandidatesListResponseDto = ServerVacancySubmissionsListResponseDto;
export type VacancyCandidateDetailsDto = ServerVacancySubmissionDetailsDto;
export type VacancyCandidateDetailsItemDto = VacancyCandidateDetailsDto['item'];

export type LoadState = 'loading' | 'ready' | 'error';
