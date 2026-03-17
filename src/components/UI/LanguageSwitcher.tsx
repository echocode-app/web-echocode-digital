'use client';

import Image from 'next/image';
import { Locale, useLocale } from 'next-intl';
import { useTransition, useState } from 'react';
import { changeLocaleAction } from '@/i18n/set-locale';
import { locales } from '@/i18n/config';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

const LanguageSwitcher = () => {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  useLockBodyScroll(open);

  const handleChangeLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }

    startTransition(() => {
      changeLocaleAction(nextLocale);
    });
    setOpen(false);
  };

  return (
    <div className="relative xl:ml-14.25 group" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={isPending}
        className={`flex items-center gap-2 px-3 py-1.5 w-20 shadow-main
          border-accent border-2 rounded-primary cursor-pointer
          duration-main z-20 relative group-hover:bg-accent
          ${open ? 'bg-accent' : ''}
          `}
      >
        <span className="relative h-5 w-6">
          <Image src="/UI/globe.svg" alt="Globe" fill />
        </span>
        <span className="relative w-6 h-4 flex items-center justify-center">
          <span
            className={`absolute transition-opacity duration-200 font-wadik text-[10px] sm:text-title-xs uppercase 
              ${isPending ? 'opacity-0' : 'opacity-100'}`}
          >
            {locale}
          </span>
          {isPending && (
            <span className="absolute w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </span>
      </button>

      <div
        className={`absolute top-full right-2 pt-2 w-15 transition-all duration-200 z-10
          ${open ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}
          xl:group-hover:opacity-100 xl:group-hover:pointer-events-auto xl:group-hover:translate-y-0`}
      >
        <div className="flex flex-col gap-1 p-2 border rounded-secondary border-gray10 bg-black/15 backdrop-blur-[26px]">
          {locales.map((lng) => (
            <button
              key={lng}
              type="button"
              onClick={() => handleChangeLocale(lng as Locale)}
              className={`w-full py-2 text-center uppercase font-wadik text-main-xs
                cursor-pointer rounded-secondary duration-main
                hover:bg-accent
                ${lng === locale ? 'bg-accent text-white' : ''}`}
            >
              {lng}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
