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
      type="button"
      onClick={() => changeLocaleAction(nextLocale as Locale)}
      className="
      flex items-center gap-2 xl:ml-14.25 px-3 py-1.5 shadow-main
   border-accent border-2 rounded-primary cursor-pointer hover:bg-accent duration-main
      "
    >
      <span className="relative h-5 w-6">
        <Image src="/UI/globe.svg" alt="Globe" fill />
      </span>
      <span className="font-wadik text-[10px] sm:text-title-xs uppercase">{locale}</span>
    </button>
  );
};

export default LanguageSwitcher;
