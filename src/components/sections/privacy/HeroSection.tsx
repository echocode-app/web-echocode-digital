import { useLocale, useTranslations } from 'next-intl';
import TypedHeroHeading from '@/components/UI/TypedHeroHeading';
import SectionContainer from '@/components/UI/section/SectionContainer';
import Image from 'next/image';

const HeroSection = () => {
  const locale = useLocale();
  const t = useTranslations('PrivacyPolicyPage.hero');
  const titleClassName =
    locale === 'de'
      ? 'text-title-2xl md:text-title-4xl leading-[28px] md:leading-[54px] lg:text-title-5xl font-title text-center md:text-left uppercase'
      : 'text-title-3xl md:text-title-5xl leading-[30px] md:leading-[66px] lg:text-title-6xl font-title text-center md:text-left uppercase';

  return (
    <section className="pt-33 md:pt-33.5 md:pb-9.75">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-170 mb-4">
            <TypedHeroHeading text={t('title')} className={titleClassName} />
          </div>
          <div className="relative mb-4 md:mb-0 w-45 h-56.75 md:w-55.5 md:min-w-55.5 md:h-69.25">
            <Image
              src={'/images/rabbits/hero/privacy.png'}
              alt={t('imageAlt')}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
