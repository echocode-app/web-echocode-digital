import OrderButton from '@/components/UI/OrderLink';
import TypedHeroHeading from '@/components/UI/TypedHeroHeading';
import SectionContainer from '@/components/UI/section/SectionContainer';
import { useTranslations } from 'next-intl';

const HeroSection = () => {
  const t = useTranslations('HomePage.HeroSection');

  return (
    <section className="pt-45 pb-31.75 md:pt-41.5 md:pb-13.5">
      <SectionContainer>
        <TypedHeroHeading
          text="Echocode: Digital Studio"
          className="max-w-85.5 mx-auto mb-4 font-wadik text-title-3xl text-center
        md:max-w-170 md:text-title-6xl font-semibold  uppercase"
        />
        <p className="mb-4.5 text-[10px] max-w-84 mx-auto md:max-w-full md:mx-0 text-center md:text-main-base md:mb-9">
          {t('subtitle')}
        </p>
        <OrderButton />
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
