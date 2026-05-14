export const locales = ['en', 'uk', 'de', 'es', 'pl'] as const;
export const defaultLocale = 'en';

export type AppLocale = (typeof locales)[number];

// Single source of truth for public locale URL prefixes.
export const localePrefixes: Record<AppLocale, string> = {
  en: '/en',
  uk: '/ua',
  de: '/de',
  es: '/es',
  pl: '/pl',
};

export function resolveLocalePrefix(locale: string): string {
  return localePrefixes[locale as AppLocale] ?? localePrefixes[defaultLocale];
}
