'use client';

import Image from 'next/image';
import { Locale, useLocale } from 'next-intl';
import { useTransition } from 'react';

import { changeLocaleAction } from '@/i18n/set-locale';
import { locales } from '@/i18n/config';

const LanguageSwitcher = () => {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const currentIndex = locales.indexOf(locale as (typeof locales)[number]);
  const nextLocale = locales[(currentIndex + 1) % locales.length];

  const handleChangeLocale = () => {
    startTransition(() => {
      changeLocaleAction(nextLocale as Locale);
    });
  };

  return (
    <button
      type="button"
      onClick={handleChangeLocale}
      disabled={isPending}
      className="
        flex items-center gap-2 xl:ml-14.25 px-3 py-1.5 w-20 shadow-main
        border-accent border-2 rounded-primary cursor-pointer
        hover:bg-accent duration-main disabled:opacity-50
      "
    >
      <span className="relative h-5 w-6">
        <Image src="/UI/globe.svg" alt="Globe" fill />
      </span>

      <span className="relative w-6 h-4 flex items-center justify-center">
        <span
          className={`absolute transition-opacity duration-200 font-wadik text-[10px] sm:text-title-xs uppercase ${
            isPending ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {locale}
        </span>
        <span
          className={`absolute transition-opacity duration-200 ${
            isPending ? 'opacity-100' : 'opacity-0'
          } w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin`}
        />
      </span>
    </button>
  );
};

export default LanguageSwitcher;
