import Image from 'next/image';
import { useTranslations } from 'next-intl';

import specializations from '@/data/directions/specializations.json';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import SpecializationList from './SpecializationList';

const SpecializationSection = () => {
  const t = useTranslations('MobilePage.SpecializationsSection');

  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-wrap justify-center lg:justify-between">
          <div className="lg:w-120">
            <div className="max-w-120">
              <SectionTitle marginBottom="10px">{t('title')}</SectionTitle>
              <p className=" md:mb-10 text-main-xs sm:text-main-sm">{t('subtitle')} </p>
            </div>
            <div className="relative mb-10 lg:mb-0 w-full md:w-120 h-63 overflow-hidden">
              <Image
                src={'/images/rabbits/specialization.png'}
                alt="Specialization"
                fill
                className="object-cover md:scale-125 
                 mask-[linear-gradient(0deg,transparent_4%,black_100%)]
                "
              />
            </div>
          </div>
          <SpecializationList list={specializations} />
        </div>
      </SectionContainer>
    </section>
  );
};

export default SpecializationSection;
