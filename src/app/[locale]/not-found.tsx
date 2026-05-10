import { useTranslations } from 'next-intl';

import ErrorLayout from '@/components/errors/ErrorLayout';
import ErrorPage from '@/components/errors/ErrorPage';

const NotFound = () => {
  const t = useTranslations('Error404Page');

  return (
    <ErrorLayout>
      <ErrorPage code={'404'} title={t('title')} description={t('description')} />
    </ErrorLayout>
  );
};

export default NotFound;
