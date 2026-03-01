import type { NextRequest } from 'next/server';

export type PublicRateLimitInput = {
  request: NextRequest;
  scope: 'forms.uploads.init';
};

export async function applyPublicRateLimitStub(input: PublicRateLimitInput): Promise<void> {
  const forwardedFor = input.request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim() || 'unknown';

  // Placeholder only: wire Redis/edge limiter and abuse alerts before production scale.
  void clientIp;
  void input.scope;
}
