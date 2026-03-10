import Image from 'next/image';
import { useTranslations } from 'next-intl';

import PageTitle from '@/components/UI/PageTitle';
import SectionContainer from '@/components/UI/section/SectionContainer';

const HeroSection = () => {
  const t = useTranslations('PartnershipPage.HeroSection');

  return (
    <section className="pt-32 md:pb-11.5">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-160 mb-2 md:mb-0">
            <PageTitle>{t('title')}</PageTitle>
          </div>
          <div className="relative w-50 h-50  md:min-w-70 md:h-69">
            <Image
              src={'/images/rabbits/hero/partnership.png'}
              alt="Partnership"
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
// md:w-79.5
export default HeroSection;
