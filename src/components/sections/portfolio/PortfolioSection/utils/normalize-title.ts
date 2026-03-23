export const normalizeTitle = (title: string): string => {
  if (!title) return '';

  return title.replaceAll('&', '＆');
};
