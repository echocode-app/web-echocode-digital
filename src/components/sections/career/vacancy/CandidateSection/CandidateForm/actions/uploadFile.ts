import { InitUploadResult } from '../types/candidate';

export async function uploadFile(file: File, uploadData: InitUploadResult) {
  const res = await fetch(uploadData.uploadUrl, {
    method: uploadData.method,
    headers: uploadData.headers,
    body: file,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.statusText}`);
  }
}
