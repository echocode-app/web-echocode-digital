'use client';

import { useTranslations } from 'next-intl';

import ErrorLayout from '@/components/errors/ErrorLayout';
import ErrorPage from '@/components/errors/ErrorPage';

const ServerError = () => {
  const t = useTranslations('Error404Page');

  return (
    <ErrorLayout>
      <ErrorPage code={'500'} title={t('title')} description={t('description')} />
    </ErrorLayout>
  );
};

export default ServerError;
