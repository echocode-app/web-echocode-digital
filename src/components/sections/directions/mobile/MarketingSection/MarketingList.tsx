import { useTranslations } from 'next-intl';

const MarketingList = () => {
  const t = useTranslations('MobilePage.MarketingSection.list');

  return (
    <ul className="flex flex-col md:flex-row justify-center gap-6">
      <li className="p-3 w-full md:max-w-122 rounded-lg border-l-2 border-accent">
        <h3 className="font-title mb-3 uppercase font-bold">{t('list01.title')}</h3>
        <p className="text-main-sm text-gray75">{t('list01.desc')} </p>
      </li>
      <li className="p-3 w-full md:max-w-122 rounded-lg border-l-2 border-accent">
        <h3 className="font-title mb-3 uppercase font-bold">{t('list02.title')}</h3>
        <p className="text-main-sm text-gray75">{t('list02.desc')} </p>
      </li>
    </ul>
  );
};

export default MarketingList;
