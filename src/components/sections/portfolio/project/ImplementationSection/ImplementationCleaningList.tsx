import { useLocale, useTranslations } from 'next-intl';

import ImplementationCleaningItem from './ImplementationCleaningItem';

const list = ['step01.desc', 'step02.desc', 'step03.desc', 'step04.desc'];

const ImplementationCleaningList = () => {
  const t = useTranslations('ImplementationCleaning');
  const locale = useLocale();
  const uaStyle = locale === 'ua' ? 'text-main-sm' : '';

  return (
    <ul className="flex flex-col gap-4 max-w-130">
      {list.map((desc, i) => (
        <ImplementationCleaningItem key={i} desc={desc} />
      ))}
      <li className="flex gap-3 items-start">
        <div className="w-1 h-1 bg-[#E3E4E6] shrink-0 rounded-full mt-2.5" />
        <p className={`text-[#E3E4E6] ${uaStyle}`}>{t('step05.desc')}</p>
      </li>
      <li className="flex gap-3 items-start">
        <div className="w-1 h-1 bg-[#E3E4E6] shrink-0 rounded-full mt-2.5" />
        <p className={`text-[#E3E4E6] ${uaStyle}`}>{t('step06.desc')}</p>
      </li>
    </ul>
  );
};

export default ImplementationCleaningList;
