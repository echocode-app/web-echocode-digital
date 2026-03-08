'use client';

export async function uploadFile(file: File, uploadUrl: string) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!res.ok) throw new Error('S3 upload failed');
}
