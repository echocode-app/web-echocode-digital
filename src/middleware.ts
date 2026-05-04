import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Apply locale routing only to public marketing pages.
  // Excludes: /admin, /api, /docs, /_next, files with extensions, etc.
  matcher: [
    '/',
    '/((?!admin|api|docs|_next|_vercel|.*\\..*).*)',
  ],
};
