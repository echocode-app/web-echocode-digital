import { useLocale } from 'next-intl';
import TypedHeroHeading from '@/components/UI/TypedHeroHeading';

const PageTitle = ({ children }: { children: string }) => {
  const locale = useLocale();
  const enStyle = locale === 'en' ? '' : 'leading-[30px] md:leading-[66px]';

  return (
    <TypedHeroHeading
      text={children}
      className={`text-title-3xl md:text-title-5xl ${enStyle} lg:text-title-6xl font-title text-center md:text-left uppercase`}
    />
  );
};

export default PageTitle;
