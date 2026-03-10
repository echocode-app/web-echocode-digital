import Image from 'next/image';
import { useTranslations } from 'next-intl';

import PageTitle from '@/components/UI/PageTitle';
import SectionContainer from '@/components/UI/section/SectionContainer';

const HeroSection = () => {
  const t = useTranslations('GamePage.HeroSection');

  return (
    <section className="pt-33 pb-2">
      <SectionContainer>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="max-w-155">
              <PageTitle>{t('title')}</PageTitle>
            </div>
            <p className="font-wadik text-title-sm text-center md:text-start mt-4">
              Game Development
            </p>
          </div>
          <div className="relative w-50 h-50 md:w-79.5 md:h-79.5">
            <Image
              priority
              src={'/images/rabbits/hero/game.png'}
              alt="Game"
              fill
              className="object-cover -scale-x-100"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default HeroSection;
