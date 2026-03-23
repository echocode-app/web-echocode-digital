const buildQuery = (searchParams: URLSearchParams, key: string, value?: string) => {
  const params = new URLSearchParams(searchParams.toString());

  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
};

export default buildQuery;
