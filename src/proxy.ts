import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const hasLocalePrefix = (pathname: string): boolean => {
  return (
    pathname === '/en' ||
    pathname.startsWith('/en/') ||
    pathname === '/ua' ||
    pathname.startsWith('/ua/') ||
    pathname === '/de' ||
    pathname.startsWith('/de/') ||
    pathname === '/es' ||
    pathname.startsWith('/es/') ||
    pathname === '/pl' ||
    pathname.startsWith('/pl/')
  );
};

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;

  if (!savedLocale && !hasLocalePrefix(pathname) && acceptLanguage.includes('ru')) {
    const url = request.nextUrl.clone();
    url.pathname = `/ua${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!admin|api|docs|trpc|_next|_vercel|.*\\..*).*)',
};
