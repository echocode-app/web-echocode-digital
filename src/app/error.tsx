'use client';

import ErrorPage from '@/components/errors/ErrorPage';

const ServerError = () => {
  return (
    <ErrorPage
      code={'500'}
      title={'Internal Server Error'}
      description={"Something went wrong on our end. We're already working to fix the issue."}
    />
  );
};

export default ServerError;
