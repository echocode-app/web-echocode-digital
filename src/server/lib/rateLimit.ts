import type { NextRequest } from 'next/server';
import { ApiError } from '@/server/lib/errors';

export type PublicRateLimitInput = {
  request: NextRequest;
  scope:
    | 'forms.uploads.init'
    | 'forms.client-project.submit'
    | 'forms.client-project.image.init'
    | 'forms.email-submissions.create'
    | 'forms.vacancy-submissions.create';
};

type ScopePolicy = {
  limit: number;
  windowMs: number;
};

const RATE_LIMIT_POLICIES: Record<PublicRateLimitInput['scope'], ScopePolicy> = {
  'forms.uploads.init': { limit: 20, windowMs: 60_000 },
  'forms.client-project.image.init': { limit: 12, windowMs: 60_000 },
  'forms.client-project.submit': { limit: 8, windowMs: 60_000 },
  'forms.email-submissions.create': { limit: 12, windowMs: 60_000 },
  'forms.vacancy-submissions.create': { limit: 8, windowMs: 60_000 },
};

type Entry = {
  count: number;
  resetAt: number;
};

const IN_MEMORY_RATE_LIMITER = new Map<string, Entry>();

export async function applyPublicRateLimitStub(input: PublicRateLimitInput): Promise<void> {
  const forwardedFor = input.request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim() || 'unknown';
  const policy = RATE_LIMIT_POLICIES[input.scope];
  const now = Date.now();
  const key = `${input.scope}:${clientIp}`;
  const current = IN_MEMORY_RATE_LIMITER.get(key);

  if (!current || current.resetAt <= now) {
    IN_MEMORY_RATE_LIMITER.set(key, {
      count: 1,
      resetAt: now + policy.windowMs,
    });
    return;
  }

  if (current.count >= policy.limit) {
    throw ApiError.fromCode('BAD_REQUEST', 'Rate limit exceeded', {
      publicMessage: 'Too many requests. Please try again later.',
      status: 429,
    });
  }

  current.count += 1;
  IN_MEMORY_RATE_LIMITER.set(key, current);
}
