import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

import TypedHeroHeading from '@/components/UI/TypedHeroHeading';
import SectionContainer from '@/components/UI/section/SectionContainer';

const HeroSection = () => {
  const t = useTranslations('MobilePage.HeroSection');
  const locale = useLocale();
  const enStyle = locale === 'en' ? '' : 'leading-[30px] md:leading-[66px]';

  return (
    <section className="pt-33 pb-2">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="max-w-165">
              <TypedHeroHeading
                text={t('title')}
                className={`${enStyle} text-title-3xl md:text-title-5xl min-[1040px]:text-title-6xl font-title text-center md:text-left`}
              />
            </div>
            <p className="font-wadik text-title-sm text-center md:text-start mt-4">
              Mobile Development
            </p>
          </div>
          <div className="relative w-50 h-50 md:w-79.5 md:h-79.5">
            <picture>
              <source media="(min-width: 768px)" srcSet="/images/rabbits/hero/desktop.png" />
              <Image
                priority
                src="/images/rabbits/hero/mobile.png"
                alt="Mobile Dev"
                fill
                className="object-cover -scale-x-100"
              />
            </picture>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
