// import { cookies } from 'next/headers';
// import { getRequestConfig } from 'next-intl/server';

// import { defaultLocale } from './config';

// export default getRequestConfig(async (params) => {
//   const store = await cookies();
//   const locale = params.locale || store.get('locale')?.value || defaultLocale;

//   const [
//     homePage,
//     layout,
//     serviceDirectionMobile,
//     serviceDirectionWeb,
//     serviceDirectionIgaming,
//     serviceDirectionGame,
//     serviceDirectionQA,
//     serviceDirectionDesign,
//     teamPage,
//     portfolioPage,
//     careerPage,
//     partnershipPage,
//     vacancyIosDev,
//     vacancyCommon,
//     vacancyQA,
//     vacancyDesign,
//     projectModal,
//     errorsPages,
//     projectECommerce,
//     projectFood,
//     projectCleaning,
//     validations,
//   ] = await Promise.all([
//     import(`./messages/${locale}/homePage.json`),
//     import(`./messages/${locale}/layout.json`),
//     import(`./messages/${locale}/service-directions/mobile-page.json`),
//     import(`./messages/${locale}/service-directions/web-page.json`),
//     import(`./messages/${locale}/service-directions/igaming-page.json`),
//     import(`./messages/${locale}/service-directions/game-page.json`),
//     import(`./messages/${locale}/service-directions/qa-page.json`),
//     import(`./messages/${locale}/service-directions/design-page.json`),
//     import(`./messages/${locale}/team-page.json`),
//     import(`./messages/${locale}/portfolio-page.json`),
//     import(`./messages/${locale}/career-page.json`),
//     import(`./messages/${locale}/partnership-page.json`),
//     import(`./messages/${locale}/vacancies/ios-dev.json`),
//     import(`./messages/${locale}/vacancies/common.json`),
//     import(`./messages/${locale}/vacancies/qa.json`),
//     import(`./messages/${locale}/vacancies/design.json`),
//     import(`./messages/${locale}/project-modal.json`),
//     import(`./messages/${locale}/errors-pages.json`),
//     import(`./messages/${locale}/projects/e-commerce.json`),
//     import(`./messages/${locale}/projects/food.json`),
//     import(`./messages/${locale}/projects/cleaning.json`),
//     import(`./messages/${locale}/validation.json`),
//   ]);

//   const messages = {
//     ...homePage,
//     ...layout,
//     ...serviceDirectionMobile,
//     ...serviceDirectionWeb,
//     ...serviceDirectionIgaming,
//     ...serviceDirectionGame,
//     ...serviceDirectionQA,
//     ...serviceDirectionDesign,
//     ...teamPage,
//     ...careerPage,
//     ...partnershipPage,
//     ...portfolioPage,
//     ...vacancyIosDev,
//     ...vacancyCommon,
//     ...vacancyQA,
//     ...vacancyDesign,
//     ...projectModal,
//     ...errorsPages,
//     ...projectECommerce,
//     ...projectFood,
//     ...projectCleaning,
//     ...validations,
//   };

//   return {
//     locale,
//     messages,
//   };
// });

import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { defaultLocale } from './config';

export default getRequestConfig(async (params) => {
  const store = await cookies();
  const locale = params.locale || store.get('locale')?.value || defaultLocale;

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
      import(`./messages/${locale}/${path}`).catch(() => {
        // console.warn(`⚠️ Missing locale "${locale}" → fallback to "${defaultLocale}" for ${path}`);
        return import(`./messages/${defaultLocale}/${path}`);
      }),
    ),
  );

  const messages = Object.assign(
    {},
    ...results.filter((r) => r.status === 'fulfilled').map((r) => r.value.default),
  );

  return {
    locale,
    messages,
  };
});
