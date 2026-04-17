import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { cache } from 'react';

import { defaultLocale } from './config';

const loadMessages = cache(async (locale: string) => {
  const paths = [
    'homePage.json',
    'layout.json',
    'service-directions/mobile-page.json',
    'service-directions/web-page.json',
    'service-directions/igaming-page.json',
    'service-directions/game-page.json',
    'service-directions/qa-page.json',
    'service-directions/design-page.json',
    'team-page.json',
    'portfolio-page.json',
    'career-page.json',
    'partnership-page.json',
    'privacy-policy-page.json',
    'vacancies/ios-dev.json',
    'vacancies/common.json',
    'vacancies/qa.json',
    'vacancies/design.json',
    'project-modal.json',
    'errors-pages.json',
    'projects/e-commerce.json',
    'projects/food.json',
    'projects/cleaning.json',
    'validation.json',
  ];

  const results = await Promise.allSettled(
    paths.map((path) =>
      import(`./messages/${locale}/${path}`).catch(
        () => import(`./messages/${defaultLocale}/${path}`),
      ),
    ),
  );

  return Object.assign(
    {},
    ...results.filter((r) => r.status === 'fulfilled').map((r) => r.value.default),
  );
});

export default getRequestConfig(async (params) => {
  const store = await cookies();
  const locale = params.locale || store.get('locale')?.value || defaultLocale;

  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});
