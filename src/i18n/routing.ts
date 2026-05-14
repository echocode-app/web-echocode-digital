import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './config';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
  localeDetection: true,
  localePrefix: {
    mode: 'always',
    prefixes: {
      uk: '/ua',
    },
  },
});
