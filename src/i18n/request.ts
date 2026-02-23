import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale } from './config';

export default getRequestConfig(async (params) => {
  const store = await cookies();
  const locale = params.locale || store.get('locale')?.value || defaultLocale;

  const homePage = (await import(`./messages/${locale}/homePage.json`)).default;
  const layout = (await import(`./messages/${locale}/layout.json`)).default;

  const messages = { ...homePage, ...layout };

  return {
    locale,
    messages,
  };
});
