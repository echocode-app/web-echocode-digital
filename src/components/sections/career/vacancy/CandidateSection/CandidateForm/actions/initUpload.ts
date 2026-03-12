import { InitUploadApiResponse, UploadedFile } from '../types/candidate';
import { InitUploadResult } from './uploadFile';

const initUpload = async (file: File): Promise<InitUploadResult> => {
  const payload: UploadedFile = {
    formType: 'vacancy',
    file: {
      path: '',
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    },
  };

  const res = await fetch('/api/forms/uploads/init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Upload init failed: ${res.statusText}`);
  }

  const data: InitUploadApiResponse = await res.json();

  if (!data.success || !data.data?.uploadUrl || !data.data?.path) {
    throw new Error('Invalid init response');
  }

  return {
    path: data.data.path,
    uploadUrl: data.data.uploadUrl,
    method: data.data.method,
    headers: data.data.headers,
    originalName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };
};

export default initUpload;
