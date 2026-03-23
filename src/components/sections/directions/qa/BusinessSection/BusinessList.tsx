'use client';

import { useTranslations } from 'next-intl';

import BusinessItem from './BusinessItem';
import { useAutoIndex } from '@/hooks/useAutoIndex';

const BusinessList = () => {
  const t = useTranslations('QAPage.BussinessSection.list');

  const activeIndex = useAutoIndex(4);

  return (
    <ul className="flex gap-8 flex-wrap justify-start">
      <li className="max-w-56.5 w-full">
        <BusinessItem title={t('bus01.title')} active={activeIndex === 0} />
      </li>
      <li className="max-w-56.5 w-full">
        <BusinessItem title={t('bus02.title')} active={activeIndex === 1} />
      </li>
      <li className="max-w-56.5 w-full">
        <BusinessItem title={t('bus03.title')} active={activeIndex === 2} />
      </li>
      <li className="max-w-56.5 w-full">
        <BusinessItem title={t('bus04.title')} active={activeIndex === 3} />
      </li>
    </ul>
  );
};

export default BusinessList;
