import { NextRequest, NextResponse } from 'next/server';
import { getRequestIdHeaderName } from '@/server/lib/requestId';

export type CorsPolicy = {
  allowedOrigins: readonly string[];
  allowedOriginPatterns?: readonly RegExp[];
  allowedMethods: readonly string[];
  allowedHeaders: readonly string[];
  exposeHeaders?: readonly string[];
  maxAgeSeconds?: number;
};

function getRequestHeaders(origin: string, policy: CorsPolicy): Headers {
  const headers = new Headers({
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': policy.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': policy.allowedHeaders.join(', '),
    Vary: 'Origin',
  });

  if (policy.exposeHeaders?.length) {
    headers.set('Access-Control-Expose-Headers', policy.exposeHeaders.join(', '));
  }

  if (typeof policy.maxAgeSeconds === 'number') {
    headers.set('Access-Control-Max-Age', String(policy.maxAgeSeconds));
  }

  return headers;
}

function isAllowedOrigin(origin: string | null, policy: CorsPolicy): origin is string {
  if (!origin) return false;
  if (policy.allowedOrigins.includes(origin)) {
    return true;
  }

  return policy.allowedOriginPatterns?.some((pattern) => pattern.test(origin)) ?? false;
}

export function createCorsPreflightHandler(policy: CorsPolicy) {
  return function handlePreflight(req: NextRequest): NextResponse {
    const origin = req.headers.get('origin');

    if (!isAllowedOrigin(origin, policy)) {
      return new NextResponse(null, {
        status: 403,
        headers: {
          Vary: 'Origin',
        },
      });
    }

    return new NextResponse(null, {
      status: 204,
      headers: getRequestHeaders(origin, policy),
    });
  };
}

export function appendCorsHeaders(
  req: NextRequest,
  response: NextResponse,
  policy: CorsPolicy,
): NextResponse {
  const origin = req.headers.get('origin');
  if (!isAllowedOrigin(origin, policy)) {
    return response;
  }

  const corsHeaders = getRequestHeaders(origin, policy);
  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

export function buildPublicIngestCorsPolicy(input: {
  allowedOrigins: readonly string[];
  allowedOriginPatterns?: readonly RegExp[];
}): CorsPolicy {
  return {
    allowedOrigins: input.allowedOrigins,
    allowedOriginPatterns: input.allowedOriginPatterns,
    allowedMethods: ['OPTIONS', 'POST'],
    allowedHeaders: ['Content-Type', 'x-client-session-id', getRequestIdHeaderName()],
    exposeHeaders: [getRequestIdHeaderName(), 'x-api-version'],
    maxAgeSeconds: 86400,
  };
}
