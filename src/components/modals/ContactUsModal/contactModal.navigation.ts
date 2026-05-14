import { localePrefixes, resolveLocalePrefix } from '@/i18n/config';

const CONTACT_MODAL_RETURN_PATH_KEY = 'contact_modal_return_path';
const localePrefixValues = Object.values(localePrefixes);

function getCurrentPathWithQuery(): string {
  if (typeof window === 'undefined') return '/';

  const path = window.location.pathname || '/';
  const query = window.location.search || '';
  const hash = window.location.hash || '';
  return `${path}${query}${hash}`;
}

function stripLocalePrefix(pathname: string): string {
  for (const prefix of localePrefixValues) {
    if (pathname === prefix) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length) || '/';
  }

  return pathname;
}

export function isContactModalPath(pathname: string): boolean {
  // Intercepted contact routes can be locale-prefixed, but modal logic needs the route kind.
  const normalizedPathname = stripLocalePrefix(pathname.split('?')[0]?.split('#')[0] || '/');
  return normalizedPathname === '/contact' || normalizedPathname === '/contact/success';
}

export function buildLocalizedContactPath(locale: string, target: 'form' | 'success'): string {
  // Preserve the active locale when moving between contact modal states.
  return `${resolveLocalePrefix(locale)}/contact${target === 'success' ? '/success' : ''}`;
}

export function buildLocalizedHomePath(locale: string): string {
  return resolveLocalePrefix(locale);
}

function isValidInternalPath(path: string | null): path is string {
  if (!path) return false;
  if (!path.startsWith('/')) return false;
  const pathname = path.split('?')[0]?.split('#')[0] ?? '';
  if (isContactModalPath(pathname)) return false;
  return true;
}

export type ContactModalReturnState = {
  path: string;
  scrollY: number;
};

export function rememberContactModalReturnPath(): void {
  if (typeof window === 'undefined') return;
  const currentPath = getCurrentPathWithQuery();

  if (isValidInternalPath(currentPath)) {
    const payload: ContactModalReturnState = {
      path: currentPath,
      scrollY: Math.max(0, Math.trunc(window.scrollY || 0)),
    };
    window.sessionStorage.setItem(CONTACT_MODAL_RETURN_PATH_KEY, JSON.stringify(payload));
  }
}

export function consumeContactModalReturnPath(): ContactModalReturnState | null {
  if (typeof window === 'undefined') return null;

  const stored = window.sessionStorage.getItem(CONTACT_MODAL_RETURN_PATH_KEY);
  window.sessionStorage.removeItem(CONTACT_MODAL_RETURN_PATH_KEY);

  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as Partial<ContactModalReturnState>;
    const path = parsed.path ?? null;
    if (!isValidInternalPath(path)) return null;
    const scrollY = Number.isFinite(parsed.scrollY)
      ? Math.max(0, Math.trunc(parsed.scrollY as number))
      : 0;

    return {
      path,
      scrollY,
    };
  } catch {
    return isValidInternalPath(stored) ? { path: stored, scrollY: 0 } : null;
  }
}

export function peekContactModalReturnPath(): ContactModalReturnState | null {
  if (typeof window === 'undefined') return null;

  const stored = window.sessionStorage.getItem(CONTACT_MODAL_RETURN_PATH_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as Partial<ContactModalReturnState>;
    const path = parsed.path ?? null;
    if (!isValidInternalPath(path)) return null;
    const scrollY = Number.isFinite(parsed.scrollY)
      ? Math.max(0, Math.trunc(parsed.scrollY as number))
      : 0;

    return {
      path,
      scrollY,
    };
  } catch {
    return isValidInternalPath(stored) ? { path: stored, scrollY: 0 } : null;
  }
}
