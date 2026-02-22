import type { Bucket } from '@google-cloud/storage';
import { getStorage } from 'firebase-admin/storage';
import { ApiError } from '@/server/lib/errors';
import { env } from '@/server/config/env';
import { getFirebaseAdminApp } from '@/server/firebase/app';
import { assertServerOnly } from '@/server/lib/serverOnly';

// Storage admin utilities are intentionally unavailable to client-side code.
assertServerOnly('src/server/firebase/storage');

/** Returns a centralized Storage bucket instance for server operations. */
export function getFirebaseStorageBucket(): Bucket {
  try {
    if (!env.firebaseStorageBucket) {
      throw ApiError.fromCode(
        'FIREBASE_UNAVAILABLE',
        'Firebase Storage bucket is not configured',
      );
    }

    const storage = getStorage(getFirebaseAdminApp());
    const bucket = storage.bucket(env.firebaseStorageBucket);

    if (!bucket.name) {
      throw ApiError.fromCode(
        'FIREBASE_UNAVAILABLE',
        'Firebase Storage bucket is not configured',
      );
    }

    return bucket;
  } catch (cause) {
    if (cause instanceof ApiError) throw cause;

    throw ApiError.fromCode(
      'FIREBASE_UNAVAILABLE',
      'Failed to initialize Firebase Storage bucket',
      { cause },
    );
  }
}

/** Fetches bucket metadata to validate Storage availability and credentials. */
export async function checkFirebaseStorageAvailability(): Promise<{ bucket: string }> {
  const bucket = getFirebaseStorageBucket();

  try {
    await bucket.getMetadata();
  } catch (cause) {
    throw ApiError.fromCode(
      'FIREBASE_UNAVAILABLE',
      'Firebase Storage service is unavailable',
      { cause },
    );
  }

  return { bucket: bucket.name };
}
