'use client';

import { Locale } from 'next-intl';
import { changeLocaleAction } from '@/i18n/set-locale';

import { locales } from '@/i18n/config';

const LanguageSwitcher = () => {
  // const locale = useLocale();

  return (
    <div className="relative w-20 border border-accent h-8.5 rounded-full xl:ml-14.25">
      <div className="absolute flex gap-2 flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-2.5">
        {locales.map((locale, i) => (
          <button key={i} onClick={() => changeLocaleAction(locale as Locale)}>
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;

// <button
//   className="flex items-center gap-2 xl:ml-14.25 px-3 py-1.5 shadow-main
//    border-accent border-2 rounded-primary cursor-pointer"
// >
{
  /* <div className="relative w-6 h-5">
        <Image src="/UI/globe.svg" alt="Globe" fill />
      </div> */
}

// {locales.map((locale) => (
//   <button key={locale} onClick={() => onChange(locale)}>
//     {locale.toUpperCase()}
//   </button>
// ))}
{
  /* <p className="font-title text-[10px] sm:text-title-xs">EN</p> */
}
// </button>
