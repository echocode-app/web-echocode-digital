import { useLocale } from 'next-intl';
import TypedHeroHeading from '@/components/UI/TypedHeroHeading';

interface PageTitleProps {
  children: string;
  fontSizeDesktop?: string;
  leading?: string;
}

const PageTitle = ({ children, fontSizeDesktop = 'lg:text-[60px]', leading }: PageTitleProps) => {
  const locale = useLocale();
  const defaultLeading = locale === 'en' ? '' : 'leading-[30px] md:leading-[66px]';

  return (
    <TypedHeroHeading
      text={children}
      className={`text-title-3xl md:text-title-5xl ${leading ?? defaultLeading} ${fontSizeDesktop} font-title text-center md:text-left uppercase`}
    />
  );
};

export default PageTitle;
