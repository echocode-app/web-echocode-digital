import Image from 'next/image';
import { useTranslations } from 'next-intl';

import PageTitle from '@/components/UI/PageTitle';
import SectionContainer from '@/components/UI/section/SectionContainer';

const HeroSection = () => {
  const t = useTranslations('IGamingPage.HeroSection');

  return (
    <section className="pt-33 pb-2">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="max-w-145">
              <PageTitle>{t('title')}</PageTitle>
            </div>
            <p className="font-wadik text-title-sm text-center md:text-start mt-4">iGaming</p>
          </div>
          <div className="relative w-50 h-50 md:w-79.5 md:h-79.5 z-10">
            <Image
              priority
              src={'/images/rabbits/hero/igaming.png'}
              alt="iGaming"
              fill
              className="object-cover -scale-x-100 z-1"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
