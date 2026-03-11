import ErrorLayout from '@/components/errors/ErrorLayout';
import ErrorPage from '@/components/errors/ErrorPage';
import { useTranslations } from 'next-intl';

const ServiceError = () => {
  const t = useTranslations('Error503Page');

  return (
    <ErrorLayout>
      <ErrorPage code={'503'} title={t('title')} description={t('description')} />
    </ErrorLayout>
  );
};

export default ServiceError;
