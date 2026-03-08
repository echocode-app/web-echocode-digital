import ErrorLayout from '@/components/errors/ErrorLayout';
import ErrorPage from '@/components/errors/ErrorPage';

const ServerError = () => {
  return (
    <ErrorLayout>
      <ErrorPage
        code={'500'}
        title="Internal Server"
        description="Something went wrong on our end. We're already working to fix the issue."
      />
    </ErrorLayout>
  );
};

export default ServerError;
