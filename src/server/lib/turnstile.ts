import { env } from '@/server/config/env';
import { ApiError } from '@/server/lib/errors';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_TOKEN_MAX_LENGTH = 2048;
const TURNSTILE_VERIFY_TIMEOUT_MS = 10_000;

type TurnstileVerifyResponse = {
  success: boolean;
  hostname?: string;
  challenge_ts?: string;
  'error-codes'?: string[];
  action?: string;
  cdata?: string;
};

/** Resolve the visitor IP from trusted proxy headers for Cloudflare remoteip checks. */
function getClientIp(headers: Headers | undefined): string | null {
  if (!headers) return null;

  const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwardedFor) return forwardedFor;

  const cfConnectingIp = headers.get('cf-connecting-ip')?.trim();
  if (cfConnectingIp) return cfConnectingIp;

  return null;
}

function getFailureReason(payload: TurnstileVerifyResponse | null): string {
  const errorCodes = payload?.['error-codes']?.filter(Boolean) ?? [];
  return errorCodes.length > 0 ? errorCodes.join(', ') : 'unknown_error';
}

/** Keep malformed or oversized widget tokens out of the upstream verify request. */
export function normalizeTurnstileToken(value: unknown): string {
  if (typeof value !== 'string') {
    throw ApiError.fromCode('FORBIDDEN', 'Turnstile token is missing', {
      publicMessage: 'Turnstile verification failed',
    });
  }

  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > TURNSTILE_TOKEN_MAX_LENGTH) {
    throw ApiError.fromCode('FORBIDDEN', 'Turnstile token is invalid', {
      publicMessage: 'Turnstile verification failed',
    });
  }

  return normalized;
}

/** Verify a public form widget token with Cloudflare before any submission is persisted. */
export async function verifyTurnstileToken(input: {
  token: string;
  requestHeaders?: Headers;
}): Promise<void> {
  const secret = env.cloudflareTurnstileSecretKey;
  if (!secret) {
    throw ApiError.fromCode(
      'SERVICE_UNAVAILABLE',
      'Cloudflare Turnstile secret key is not configured',
      {
        publicMessage: 'Service is temporarily unavailable',
      },
    );
  }

  const body = new URLSearchParams({
    secret,
    response: normalizeTurnstileToken(input.token),
  });

  const clientIp = getClientIp(input.requestHeaders);
  if (clientIp) {
    body.set('remoteip', clientIp);
  }

  let response: Response;
  try {
    response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(TURNSTILE_VERIFY_TIMEOUT_MS),
    });
  } catch (cause) {
    throw ApiError.fromCode('SERVICE_UNAVAILABLE', 'Turnstile verification request failed', {
      cause,
      publicMessage: 'Service is temporarily unavailable',
    });
  }

  let payload: TurnstileVerifyResponse | null = null;
  try {
    payload = (await response.json()) as TurnstileVerifyResponse;
  } catch (cause) {
    throw ApiError.fromCode('SERVICE_UNAVAILABLE', 'Turnstile verification response was invalid', {
      cause,
      publicMessage: 'Service is temporarily unavailable',
    });
  }

  if (!response.ok) {
    throw ApiError.fromCode(
      'SERVICE_UNAVAILABLE',
      `Turnstile verification failed with upstream status ${response.status}`,
      {
        publicMessage: 'Service is temporarily unavailable',
      },
    );
  }

  if (!payload.success) {
    throw ApiError.fromCode(
      'FORBIDDEN',
      `Turnstile verification failed: ${getFailureReason(payload)}`,
      {
        publicMessage: 'Turnstile verification failed',
      },
    );
  }
}
