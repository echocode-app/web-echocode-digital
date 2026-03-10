import { useTranslations } from 'next-intl';
import SolutionsItem from './SolutionsItem';

const SolutionsList = () => {
  const t = useTranslations('PartnershipPage.SolutionsSection');

  return (
    <ul className="flex justify-center flex-wrap gap-6">
      <SolutionsItem title={t('solutionsList.sol01.title')} desc={t('solutionsList.sol01.desc')} />
      <SolutionsItem title={t('solutionsList.sol02.title')} desc={t('solutionsList.sol02.desc')} />
      <SolutionsItem title={t('solutionsList.sol03.title')} desc={t('solutionsList.sol03.desc')} />
      <SolutionsItem title={t('solutionsList.sol04.title')} desc={t('solutionsList.sol04.desc')} />
    </ul>
  );
};

export default SolutionsList;
