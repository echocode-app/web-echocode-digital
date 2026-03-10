import Image from 'next/image';
import { useTranslations } from 'next-intl';

const SolutionList = () => {
  const t = useTranslations('IGamingPage.SolutionsSection');

  return (
    <ul className="max-w-154 flex flex-col gap-6">
      <li className="flex flex-col gap-3 py-3">
        <div className="flex gap-2">
          <div className="relative w-5.5 h-6">
            <Image src={'/UI/check.svg'} alt="Check" fill />
          </div>
          <h3 className="font-title uppercase font-bold">{t('solutionsList.sol01.title')}</h3>
        </div>
        <p className="text-main-sm text-gray75">{t('solutionsList.sol01.desc')}</p>
        <ul className="flex gap-3 text-accent text-main-sm justify-end">
          {['#Native', '#PWA / Web.js'].map((item, i) => (
            <li key={i} className="px-2">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </li>
      <li className="flex flex-col gap-3 py-3">
        <div className="flex gap-2">
          <div className="relative w-5.5 h-6">
            <Image src={'/UI/check.svg'} alt="Check" fill />
          </div>
          <h3 className="font-title uppercase font-bold">{t('solutionsList.sol02.title')}</h3>
        </div>
        <p className="text-main-sm text-gray75">{t('solutionsList.sol02.desc')}</p>
        <ul className="flex gap-3 text-accent text-main-sm justify-end">
          {['#RETENTION', '#VISIBILITY'].map((item, i) => (
            <li key={i} className="px-2">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </li>
      <li className="flex flex-col gap-3 py-3">
        <div className="flex gap-2">
          <div className="relative w-5.5 h-6">
            <Image src={'/UI/check.svg'} alt="Check" fill />
          </div>
          <h3 className="font-title uppercase font-bold">{t('solutionsList.sol03.title')}</h3>
        </div>
        <p className="text-main-sm text-gray75">{t('solutionsList.sol03.desc')}</p>
        <ul className="flex gap-3 text-accent text-main-sm justify-end">
          {['#MANAGEMENT', '#SCALABILITY'].map((item, i) => (
            <li key={i} className="px-2">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};

export default SolutionList;
