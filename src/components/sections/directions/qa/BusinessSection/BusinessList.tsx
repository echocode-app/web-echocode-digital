import { useTranslations } from 'next-intl';

import BusinessItem from './BusinessItem';

const BusinessList = () => {
  const t = useTranslations('QAPage.BussinessSection.list');

  return (
    <ul className="flex gap-8 flex-wrap justify-start">
      <li className="max-w-56.5 w-full">
        <BusinessItem title={t('bus01.title')} />
      </li>
      <li className="max-w-56.5 w-full">
        <BusinessItem title={t('bus02.title')} />
      </li>
      <li className="max-w-56.5 w-full">
        <BusinessItem title={t('bus03.title')} />
      </li>
      <li className="max-w-56.5 w-full">
        <BusinessItem title={t('bus04.title')} />
      </li>
    </ul>
  );
};

export default BusinessList;
