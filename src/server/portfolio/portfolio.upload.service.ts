import { randomUUID } from 'node:crypto';
import { getFirebaseStorageBucket } from '@/server/firebase/storage';
import { ApiError } from '@/server/lib/errors';
import { assertSafeImageName } from '@/server/forms/client-project/clientProject.validation';
import {
  portfolioImageUploadInitSchema,
} from '@/server/portfolio/portfolio.validation';
import { validate } from '@/server/lib/validate';
import {
  isImageMimeType,
  MAX_IMAGE_SIZE_BYTES,
  type UploadedFileInput,
} from '@/shared/validation/submissions.files';

const UPLOAD_URL_TTL_MS = 10 * 60 * 1000;

function slugifySegment(value: string): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return normalized || 'project';
}

function assertPortfolioImagePolicy(input: {
  mimeType: string;
  sizeBytes: number;
  originalName: string;
}): void {
  if (!isImageMimeType(input.mimeType)) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      `Unsupported image MIME type: ${input.mimeType}`,
    );
  }

  if (input.sizeBytes <= 0 || input.sizeBytes > MAX_IMAGE_SIZE_BYTES) {
    throw ApiError.fromCode('ATTACHMENT_VERIFICATION_FAILED', 'Image exceeds allowed size');
  }

  try {
    assertSafeImageName(input.originalName);
  } catch {
    throw ApiError.fromCode('ATTACHMENT_VERIFICATION_FAILED', 'Image filename is suspicious');
  }
}

function buildFirebasePublicUrl(bucketName: string, objectPath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    objectPath,
  )}?alt=media`;
}

export async function createPortfolioImageUploadInit(input: {
  rawBody: unknown;
}): Promise<{
  uploadUrl: string;
  path: string;
  method: 'PUT';
  expiresAt: string;
  headers: { 'Content-Type': string };
}> {
  const parsed = validate(portfolioImageUploadInitSchema, input.rawBody);
  const file = parsed.file;

  assertPortfolioImagePolicy(file);

  const bucket = getFirebaseStorageBucket();
  const path = `uploads/portfolio/drafts/${randomUUID()}`;
  const expiresAt = new Date(Date.now() + UPLOAD_URL_TTL_MS);

  try {
    const [uploadUrl] = await bucket.file(path).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: expiresAt,
      contentType: file.mimeType,
    });

    return {
      uploadUrl,
      path,
      method: 'PUT',
      expiresAt: expiresAt.toISOString(),
      headers: {
        'Content-Type': file.mimeType,
      },
    };
  } catch (cause) {
    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to generate portfolio upload URL', {
      cause,
    });
  }
}

export async function resolvePortfolioImageUrl(image: UploadedFileInput): Promise<{
  imagePath: string;
  imageUrl: string;
}> {
  const bucket = getFirebaseStorageBucket();
  assertPortfolioImagePolicy(image);

  const file = bucket.file(image.path);

  let metadata: { contentType?: string | null; size?: string | number | null };
  try {
    const [raw] = await file.getMetadata();
    metadata = raw;
  } catch (cause) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Uploaded portfolio image was not found',
      { cause },
    );
  }

  if (metadata.contentType !== image.mimeType) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Uploaded portfolio image MIME type mismatch',
    );
  }

  const sizeRaw = metadata.size;
  const parsedSize =
    typeof sizeRaw === 'number'
      ? sizeRaw
      : typeof sizeRaw === 'string' && /^\d+$/.test(sizeRaw)
        ? Number(sizeRaw)
        : null;

  if (parsedSize !== image.sizeBytes) {
    throw ApiError.fromCode(
      'ATTACHMENT_VERIFICATION_FAILED',
      'Uploaded portfolio image size mismatch',
    );
  }

  return {
    imagePath: image.path,
    imageUrl: buildFirebasePublicUrl(bucket.name, image.path),
  };
}

export async function deletePortfolioImage(path: string | null): Promise<void> {
  if (!path) return;

  const bucket = getFirebaseStorageBucket();

  try {
    await bucket.file(path).delete();
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    if (message.includes('No such object')) return;

    throw ApiError.fromCode('FIREBASE_UNAVAILABLE', 'Failed to delete portfolio image', {
      cause,
    });
  }
}

export function buildPortfolioSlugFromTitle(title: string): string {
  return slugifySegment(title);
}
