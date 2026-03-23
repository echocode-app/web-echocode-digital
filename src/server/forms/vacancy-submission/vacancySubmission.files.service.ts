import { getFirebaseStorageBucket } from '@/server/firebase/storage';
import { ApiError } from '@/server/lib/errors';

function toReadSignedUrlExpiry(): Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

export async function getVacancySubmissionCvReadUrl(path: string): Promise<string> {
  const bucket = getFirebaseStorageBucket();
  const file = bucket.file(path);

  try {
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: toReadSignedUrlExpiry(),
    });

    return url;
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to generate CV access URL', {
      cause,
    });
  }
}
