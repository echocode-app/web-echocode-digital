import { useTranslations } from 'next-intl';

import PhilosophyItem from './PhilosophyItem';

const PhilosophyList = () => {
  const t = useTranslations('DesignPage.PhilosophySection.philosophyList');

  return (
    <ul className="flex flex-col md:flex-row items-center gap-6 md:items-stretch">
      <PhilosophyItem title={t('phi01.title')} desc={t('phi01.desc')} />
      <PhilosophyItem title={t('phi02.title')} desc={t('phi02.desc')} />
      <PhilosophyItem title={t('phi03.title')} desc={t('phi03.desc')} />
    </ul>
  );
};

export default PhilosophyList;
