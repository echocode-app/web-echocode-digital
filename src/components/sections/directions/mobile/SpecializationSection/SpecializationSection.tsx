import Image from 'next/image';

import specializations from '@/data/directions/specializations.json';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import SpecializationList from './SpecializationList';

const SpecializationSection = () => {
  return (
    <section className="pb-10 md:pb-25">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="flex flex-wrap justify-center lg:justify-between">
          <div className="lg:w-120">
            <div className="max-w-120">
              <SectionTitle marginBottom="10px">PROFESSIONAL SPECIALIZATION</SectionTitle>
              <p className=" md:mb-10 text-main-xs sm:text-main-sm">
                We are focused on building products that deliver predictable results. Our expertise
                spans complex technical solutions and efficient monetization models.
              </p>
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
