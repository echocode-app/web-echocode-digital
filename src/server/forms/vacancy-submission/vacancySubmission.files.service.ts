import { getFirebaseStorageBucket } from '@/server/firebase/storage';
import { ApiError } from '@/server/lib/errors';

function toReadSignedUrlExpiry(): Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

export async function getVacancySubmissionCvReadUrl(path: string): Promise<string> {
  const normalizedPath = path.trim();
  if (!normalizedPath) {
    throw ApiError.fromCode('BAD_REQUEST', 'Vacancy CV path is missing');
  }

  const bucket = getFirebaseStorageBucket();
  const file = bucket.file(normalizedPath);

  try {
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: toReadSignedUrlExpiry(),
    });

    return url;
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to generate vacancy CV access URL', { cause });
  }
}
