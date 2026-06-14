import { env } from '@/server/config/env';
import { ApiError } from '@/server/lib/errors';

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const RECAPTCHA_VERIFY_TIMEOUT_MS = 5_000;

type RecaptchaVerifyResponse = {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
};

function normalizeHostname(value: string | null | undefined): string | null {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed) return null;

  if (trimmed.includes('://')) {
    try {
      return new URL(trimmed).hostname || null;
    } catch {
      return null;
    }
  }

  return trimmed.split(':')[0] || null;
}

function getExpectedHostname(headers: Headers | undefined): string | null {
  if (!headers) return null;

  return (
    normalizeHostname(headers.get('origin')) ??
    normalizeHostname(headers.get('referer')) ??
    normalizeHostname(headers.get('host'))
  );
}

function getCaptchaTokenFromBody(rawBody: unknown): unknown {
  if (typeof rawBody !== 'object' || rawBody === null || Array.isArray(rawBody)) {
    return undefined;
  }

  return (rawBody as Record<string, unknown>).captchaToken;
}

function normalizeCaptchaToken(value: unknown): string {
  if (typeof value !== 'string') {
    throw ApiError.fromCode('FORBIDDEN', 'Captcha token is missing', {
      publicMessage: 'Captcha verification failed',
    });
  }

  const normalized = value.trim();

  if (!normalized) {
    throw ApiError.fromCode('FORBIDDEN', 'Captcha token is empty', {
      publicMessage: 'Captcha verification failed',
    });
  }

  return normalized;
}

export async function verifyRecaptchaTokenFromBody(input: {
  rawBody: unknown;
  requestHeaders?: Headers;
}): Promise<void> {
  const secret = env.recaptchaSecretKey;

  if (!secret) {
    throw ApiError.fromCode('SERVICE_UNAVAILABLE', 'reCAPTCHA secret key is not configured', {
      publicMessage: 'Service is temporarily unavailable',
    });
  }

  let response: Response;

  try {
    response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret,
        response: normalizeCaptchaToken(getCaptchaTokenFromBody(input.rawBody)),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(RECAPTCHA_VERIFY_TIMEOUT_MS),
    });
  } catch (cause) {
    throw ApiError.fromCode('SERVICE_UNAVAILABLE', 'reCAPTCHA verification request failed', {
      cause,
      publicMessage: 'Service is temporarily unavailable',
    });
  }

  let payload: RecaptchaVerifyResponse;

  try {
    payload = (await response.json()) as RecaptchaVerifyResponse;
  } catch (cause) {
    throw ApiError.fromCode('SERVICE_UNAVAILABLE', 'reCAPTCHA verification response was invalid', {
      cause,
      publicMessage: 'Service is temporarily unavailable',
    });
  }

  if (!response.ok || !payload.success) {
    throw ApiError.fromCode(
      'FORBIDDEN',
      `reCAPTCHA verification failed: ${payload['error-codes']?.join(', ') ?? 'unknown_error'}`,
      {
        publicMessage: 'Captcha verification failed',
      },
    );
  }

  const expectedHostname = getExpectedHostname(input.requestHeaders);
  const verifiedHostname = normalizeHostname(payload.hostname);

  if (expectedHostname && verifiedHostname !== expectedHostname) {
    throw ApiError.fromCode(
      'FORBIDDEN',
      `reCAPTCHA hostname mismatch: expected ${expectedHostname}, got ${verifiedHostname ?? 'missing'}`,
      {
        publicMessage: 'Captcha verification failed',
      },
    );
  }
}
