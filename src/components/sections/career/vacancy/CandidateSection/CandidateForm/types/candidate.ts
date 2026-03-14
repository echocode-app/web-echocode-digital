import { VacancyData } from '../../../types/vacancy';

type CandidateAttribution = {
  source: string;
  medium?: string;
  campaign?: string;
};

export interface CandidateSubmissionPayload {
  profileUrl: string;
  cvFile: {
    path: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
  };
  vacancy: VacancyData;
  siteId?: string;
  siteHost?: string;
  attribution?: CandidateAttribution;
}

export interface UploadedFile {
  formType: 'vacancy';
  file: {
    path: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
  };
  siteId?: string;
  siteHost?: string;
  attribution?: CandidateAttribution;
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
