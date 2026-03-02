import ErrorPage from '@/components/errors/ErrorPage';

const VacancyError = () => {
  return (
    <ErrorPage
      code={'404'}
      title="Page Not Found"
      description="Your search has ventured beyond the known universe."
    />
  );
};

export default VacancyError;
