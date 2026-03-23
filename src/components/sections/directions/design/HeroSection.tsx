import Image from 'next/image';
import { useTranslations } from 'next-intl';

import PageTitle from '@/components/UI/PageTitle';
import SectionContainer from '@/components/UI/section/SectionContainer';

const HeroSection = () => {
  const t = useTranslations('DesignPage.HeroSection');

  return (
    <section className="pt-33 md:pt-45.5  md:pb-14">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="md:max-w-125 lg:max-w-197.5">
              <PageTitle>{t('title')}</PageTitle>
            </div>
            <p className="font-wadik text-title-sm text-center md:text-start mt-4">UI／UX</p>
          </div>
          <div className="relative w-70 h-50 md:w-74 md:min-w-70 md:h-55">
            <Image
              priority
              src={'/images/rabbits/hero/design.png'}
              alt="Design"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
