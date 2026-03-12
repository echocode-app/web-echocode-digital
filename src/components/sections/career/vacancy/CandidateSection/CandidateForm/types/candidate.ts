import { VacancyData } from '../../../types/vacancy';

export interface CandidateSubmissionPayload {
  profileUrl: string;
  cvFile: {
    path: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
  };
  vacancy: VacancyData;
}

export interface UploadedFile {
  formType: 'vacancy';
  file: {
    path: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
  };
}

export interface InitUploadApiResponse {
  success: boolean;
  data: {
    uploadUrl: string;
    path: string;
    method: 'PUT';
    expiresAt: string;
    headers: {
      'Content-Type': string;
    };
  };
}

export interface InitUploadResult {
  path: string;
  uploadUrl: string;
  method: 'PUT';
  headers: Record<string, string>;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export type SubmitStatus = 'idle' | 'pending' | 'success' | 'error' | 'idle';
