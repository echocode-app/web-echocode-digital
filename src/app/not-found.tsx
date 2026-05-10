import ErrorPage from '@/components/errors/ErrorPage';

const GlobalNotFound = () => {
  return (
    <html lang="en">
      <body>
        <ErrorPage
          code={'404'}
          title={'Page Not Found'}
          description={'Your search has ventured beyond the known universe.'}
        />
      </body>
    </html>
  );
};

export default GlobalNotFound;
