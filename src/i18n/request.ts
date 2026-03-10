import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale } from './config';

export default getRequestConfig(async (params) => {
  const store = await cookies();
  const locale = params.locale || store.get('locale')?.value || defaultLocale;

  const homePage = (await import(`./messages/${locale}/homePage.json`)).default;
  const layout = (await import(`./messages/${locale}/layout.json`)).default;
  const serviceDirectionMobile = (
    await import(`./messages/${locale}/service-directions/mobile-page.json`)
  ).default;
  const serviceDirectionWeb = (
    await import(`./messages/${locale}/service-directions/web-page.json`)
  ).default;
  const serviceDirectionIgaming = (
    await import(`./messages/${locale}/service-directions/igaming-page.json`)
  ).default;
  const serviceDirectionGame = (
    await import(`./messages/${locale}/service-directions/game-page.json`)
  ).default;
  const serviceDirectionQA = (await import(`./messages/${locale}/service-directions/qa-page.json`))
    .default;
  const serviceDirectionDesign = (
    await import(`./messages/${locale}/service-directions/design-page.json`)
  ).default;
  const teamPage = (await import(`./messages/${locale}/team-page.json`)).default;
  const careerPage = (await import(`./messages/${locale}/career-page.json`)).default;

  const messages = {
    ...homePage,
    ...layout,
    ...serviceDirectionMobile,
    ...serviceDirectionWeb,
    ...serviceDirectionIgaming,
    ...serviceDirectionGame,
    ...serviceDirectionQA,
    ...serviceDirectionDesign,
    ...teamPage,
    ...careerPage,
  };

  return {
    locale,
    messages,
  };
});
