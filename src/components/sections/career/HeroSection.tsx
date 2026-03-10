import Image from 'next/image';
import { useTranslations } from 'next-intl';

import PageTitle from '@/components/UI/PageTitle';
import SectionContainer from '@/components/UI/section/SectionContainer';

const HeroSection = () => {
  const t = useTranslations('CareerPage.HeroSection');

  return (
    <section className="pt-33 md:pt-29.5 md:pb-8">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-135">
            <PageTitle>{t('title')}</PageTitle>
          </div>
          <div className="relative w-50 h-59.5 md:w-70 md:h-75">
            <Image
              src={'/images/rabbits/hero/career.png'}
              alt="Career"
              fill
              priority
              className="object-cover -scale-x-100"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
