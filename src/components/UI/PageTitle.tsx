import { useLocale } from 'next-intl';

const PageTitle = ({ children }: { children: string }) => {
  const locale = useLocale();
  const enStyle = locale === 'en' ? '' : 'leading-[30px] md:leading-[66px]';

  return (
    <h1
      className={`text-title-3xl md:text-title-5xl ${enStyle} lg:text-title-6xl font-title text-center md:text-left uppercase`}
    >
      {children}
    </h1>
  );
};

export default PageTitle;
