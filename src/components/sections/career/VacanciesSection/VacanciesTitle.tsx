import SectionTitle from '@/components/UI/section/SectionTitle';
import { useTranslations } from 'next-intl';

const VacanciesTitle = () => {
  const t = useTranslations('CareerPage.VacanciesSection');

  return <SectionTitle>{t('title')}</SectionTitle>;
};

export default VacanciesTitle;
