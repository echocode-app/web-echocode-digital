'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PatternFormat } from 'react-number-format';

import { COUNTRIES, LOCALE_TO_COUNTRY_LANG } from './phoneCountries';

const getCountryByLocale = (locale?: string) => {
  const lang = LOCALE_TO_COUNTRY_LANG[locale?.toLowerCase() ?? ''];

  return COUNTRIES.find((country) => country.lang === lang) ?? COUNTRIES[0];
};

type ContactInputNumberProps = {
  label: string;
  name: string;
  value: string;
  locale?: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
  onClearWithoutValidation?: () => void;
  onCountryCodeChange: (value: string) => void;
};

export default function ContactInputNumber({
  label,
  name,
  value,
  locale,
  error,
  disabled,
  onBlur,
  onChange,
  onClearWithoutValidation,
  onCountryCodeChange,
}: ContactInputNumberProps) {
  const inputId = `contact-input-${name}`;

  const [selectedCountry, setSelectedCountry] = useState(getCountryByLocale(locale));
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  return (
    <div className="relative w-full h-fit">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>

      <div
        className={`
        flex items-center w-full h-11.5 px-4
        hover:border-accent focus-within:border-accent duration-main transition-colors
        border border-white rounded-secondary bg-transparent
        ${error ? 'border-[#ff8d8d]' : ''}
      `}
      >
        <div className="relative flex items-center mr-1 h-4">
          <button
            type="button"
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center justify-center gap-1"
          >
            <span className="flex justify-center items-center h-3">{selectedCountry.flag}</span>
            <Image
              src="/UI/dropdown-icon.svg"
              alt="Dropdown Icon"
              width={12}
              height={12}
              className={`transition-transform duration-500 ease-in-out min-w-3 min-h-3 ${
                isSelectorOpen ? 'rotate-0' : 'rotate-180'
              }`}
            />
          </button>

          <ul
            className={`absolute top-full left-0 mt-2 px-1 py-3 w-64 bg-black border border-gray16
            rounded-secondary shadow-xl z-50 max-h-80 overflow-y-auto scrollbar-brand
            origin-top transition-all duration-main ease-out
            ${
              isSelectorOpen
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {COUNTRIES.map((c, i) => {
              const showDivider = c.isExtra && COUNTRIES[i + 1] && !COUNTRIES[i + 1].isExtra;

              return (
                <li key={i}>
                  <div
                    className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer 
                        font-wadik font-bold uppercase rounded-secondary duration-200"
                    onClick={() => {
                      setSelectedCountry(c);
                      setIsSelectorOpen(false);
                      onCountryCodeChange(c.code);
                      onClearWithoutValidation?.();
                    }}
                  >
                    <span className="scale-120">{c.flag}</span>
                    <span className="text-[10px]">{c.code}</span>
                    <p className="text-[8px] text-primary-gray">{c.name}</p>
                  </div>
                  {showDivider && (
                    <div
                      className="border-b border-gray16 my-2 mx-3 list-none"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <span className="ml-1 font-wadik font-bold text-[10px] uppercase">
            {selectedCountry.code}
          </span>
        </div>

        <PatternFormat
          id={inputId}
          format={selectedCountry.mask}
          value={value}
          onValueChange={(values) => {
            onChange(values.formattedValue);
          }}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={selectedCountry.mask.replace(/#/g, '0')}
          className="bg-transparent border-none outline-none w-full
           font-wadik font-bold uppercase text-[10px] no-autofill-bg
           placeholder:text-gray50 placeholder:font-wadik tracking-wider placeholder:text-[10px]"
        />
      </div>
      <div className="pointer-events-none absolute left-1 top-[calc(100%)] md:top-[calc(100%+4px)] h-4 overflow-hidden">
        <p
          className={`text-[10px] text-[#ff8d8d] transition-opacity duration-main ${
            error ? 'opacity-100' : 'opacity-0'
          }`}
          aria-live="polite"
        >
          {error ?? ' '}
        </p>
      </div>
      {isSelectorOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsSelectorOpen(false)} />
      )}
    </div>
  );
}
