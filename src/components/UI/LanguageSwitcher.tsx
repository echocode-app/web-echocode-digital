'use client';

import Image from 'next/image';
import { Locale, useLocale } from 'next-intl';

import { changeLocaleAction } from '@/i18n/set-locale';
import { locales } from '@/i18n/config';

const LanguageSwitcher = () => {
  const locale = useLocale() as Locale;

  const currentIndex = locales.indexOf(locale as (typeof locales)[number]);
  const nextLocale = locales[(currentIndex + 1) % locales.length];

  return (
    <button
      onClick={() => changeLocaleAction(nextLocale as Locale)}
      className="
      flex items-center gap-2 xl:ml-14.25 px-3 py-1.5 shadow-main
   border-accent border-2 rounded-primary cursor-pointer hover:bg-accent duration-main
      "
    >
      <div className="relative w-6 h-5">
        <Image src="/UI/globe.svg" alt="Globe" fill />
      </div>
      <p className="font-wadik text-[10px] sm:text-title-xs uppercase">{locale}</p>
    </button>
  );
};

export default LanguageSwitcher;
