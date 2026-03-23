import { NextRequest, NextResponse } from 'next/server';

const ADMIN_HOSTS = new Set(['echocode.cloud', 'www.echocode.cloud']);

function normalizeHost(value: string | null): string {
  if (!value) return '';
  return value.toLowerCase().split(':')[0] ?? '';
}

function isPublicPath(pathname: string): boolean {
  if (pathname === '/' || pathname === '') return true;
  if (pathname.startsWith('/admin')) return false;
  if (pathname.startsWith('/api')) return false;
  if (pathname.startsWith('/_next')) return false;
  if (pathname.startsWith('/images')) return false;
  if (pathname.startsWith('/favicon')) return false;
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return false;
  if (pathname.includes('.')) return false;
  return true;
}

export function middleware(request: NextRequest) {
  const host = normalizeHost(request.headers.get('x-forwarded-host') ?? request.headers.get('host'));
  if (!ADMIN_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  if (!isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const targetUrl = request.nextUrl.clone();
  targetUrl.pathname = '/admin';
  targetUrl.search = search;
  return NextResponse.redirect(targetUrl);
}

export const config = {
  matcher: '/:path*',
};
