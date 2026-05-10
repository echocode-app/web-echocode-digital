import { useTranslations } from 'next-intl';

import ErrorPage from '@/components/errors/ErrorPage';

const VacancyError = () => {
  const t = useTranslations('Error404Page');

  return <ErrorPage code={'404'} title={t('title')} description={t('description')} />;
};

export default VacancyError;
