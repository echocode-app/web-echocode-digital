'use client';

import { useAutoIndex } from '@/hooks/useAutoIndex';
import { useTranslations } from 'next-intl';

const EngineeringList = () => {
  const t = useTranslations('WebPage.EngineeringSection.engineeringList');

  const activeIndex = useAutoIndex(3);

  return (
    <ul className="flex flex-wrap justify-center items-center flex-col md:flex-row lg:flex-col gap-6 w-full lg:w-fit">
      <li
        className={`p-3 w-full max-w-120 md:max-w-87.5 rounded-secondary border  
       duration-main ${activeIndex === 0 ? 'border-accent' : 'border-main-border'}`}
      >
        <h3 className="mb-3 font-title text-white font-bold pointer-events-none">
          {t('list01.title')}
        </h3>
        <ul className="px-2 text-main-sm text-gray75 pointer-events-none">
          <li className="flex gap-2 items-center">
            <div className="w-0.75 h-0.75 bg-gray75 rounded-full" />
            <p>{t('list01.eng01')}</p>
          </li>
          <li className="flex gap-2 items-center">
            <div className="w-0.75 h-0.75 bg-gray75 rounded-full" />
            <p>{t('list01.eng02')}</p>
          </li>
          <li className="flex gap-2 items-center">
            <div className="w-0.75 h-0.75 bg-gray75 rounded-full" />
            <p>{t('list01.eng03')}</p>
          </li>
        </ul>
      </li>
      <li
        className={`p-3 w-full max-w-120 md:max-w-87.5 lg:w-87.5 rounded-secondary border 
         duration-main ${activeIndex === 1 ? 'border-accent' : 'border-main-border'}`}
      >
        <h3 className="mb-3 font-title font-bold text-white pointer-events-none">
          {t('list02.title')}
        </h3>
        <ul className="px-2 text-main-sm text-gray75 pointer-events-none">
          <li className="flex gap-2 items-center">
            <div className="w-0.75 h-0.75 bg-gray75 rounded-full" />
            <p>{t('list02.eng01')}</p>
          </li>
          <li className="flex gap-2 items-center">
            <div className="w-0.75 h-0.75 bg-gray75 rounded-full" />
            <p>{t('list02.eng02')}</p>
          </li>
          <li className="flex gap-2 items-center">
            <div className="w-0.75 h-0.75 bg-gray75 rounded-full" />
            <p>{t('list02.eng03')}</p>
          </li>
        </ul>
      </li>
      <li
        className={`p-3 w-full max-w-120 md:max-w-87.5 lg:w-87.5 rounded-secondary border 
        duration-main ${activeIndex === 2 ? 'border-accent' : 'border-main-border'}`}
      >
        <h3 className="mb-3 font-title font-bold text-white pointer-events-none">
          {t('list03.title')}
        </h3>
        <ul className="px-2 text-main-sm text-gray75 pointer-events-none">
          <li className="flex gap-2 items-center">
            <div className="w-0.75 h-0.75 bg-gray75 rounded-full" />
            <p>{t('list03.eng01')}</p>
          </li>
          <li className="flex gap-2 items-center">
            <div className="w-0.75 h-0.75 bg-gray75 rounded-full" />
            <p>{t('list03.eng02')}</p>
          </li>
          <li className="flex gap-2 items-center">
            <div className="w-0.75 h-0.75 bg-gray75 rounded-full" />
            <p>{t('list03.eng03')}</p>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default EngineeringList;
