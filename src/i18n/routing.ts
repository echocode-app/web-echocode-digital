import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './config';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
  localeDetection: true,
  // Prefixed locale URLs are canonical, so we do not need a response cookie per page view.
  localeCookie: false,
  localePrefix: {
    mode: 'always',
    prefixes: {
      uk: '/ua',
    },
  },
});
