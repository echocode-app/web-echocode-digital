'use client';

import { peekContactModalReturnPath } from '@/components/modals/ContactUsModal/contactModal.navigation';

export function readVisitedFlag(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function writeVisitedFlag(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(key, '1');
  } catch {}
}

export function normalizeStorageToken(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
}

export function isContactModalPath(pathname: string): boolean {
  return pathname === '/contact' || pathname === '/contact/success';
}

export function normalizeRoutePathname(pathname: string): string {
  return pathname.split('?')[0]?.split('#')[0] || '/';
}

export function getNavigationType(): PerformanceNavigationTiming['type'] | null {
  if (typeof window === 'undefined' || typeof performance === 'undefined') {
    return null;
  }

  const navigationEntry = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;

  return navigationEntry?.type ?? null;
}

const INITIAL_CLIENT_PATHNAME = typeof window !== 'undefined' ? window.location.pathname : null;
const INITIAL_NAVIGATION_TYPE = getNavigationType();

export function resolveTypedHeroPathname(pathname: string): string {
  if (!isContactModalPath(pathname)) {
    return pathname;
  }

  return normalizeRoutePathname(
    peekContactModalReturnPath()?.path ||
      (INITIAL_CLIENT_PATHNAME && !isContactModalPath(INITIAL_CLIENT_PATHNAME)
        ? INITIAL_CLIENT_PATHNAME
        : '/'),
  );
}

export function shouldSkipTypedHeroAnimation(pathname: string): boolean {
  return INITIAL_NAVIGATION_TYPE === 'reload' && pathname === INITIAL_CLIENT_PATHNAME;
}

export function buildTypedHeroKeys(
  pathname: string,
  text: string,
): {
  headingKey: string;
  visitedKey: string;
} {
  const normalizedHeadingKey = `${normalizeStorageToken(pathname)}:${normalizeStorageToken(text)}`;

  return {
    headingKey: `echocode:hero-heading:${normalizedHeadingKey}`,
    visitedKey: `echocode:hero-heading:visited:${normalizedHeadingKey}`,
  };
}
