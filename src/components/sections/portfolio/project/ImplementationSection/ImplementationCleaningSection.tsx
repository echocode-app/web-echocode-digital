import Image from 'next/image';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import SectionTitle from '@/components/UI/section/SectionTitle';
import ImplementationCleaningList from './ImplementationCleaningList';

const ImplementationCleaningSection = () => {
  return (
    <section className="pb-10 md:pb-31">
      <SectionGradientLine height="1" />
      <SectionContainer>
        <div className="mb-10">
          <SectionTitle>Implementation</SectionTitle>
        </div>
        <div className="flex gap-10 lg:gap-0 flex-col lg:flex-row items-center lg:justify-between">
          <div className="relative aspect-426/324 w-full min-[458px]:w-106.5 min-[458px]:h-81">
            <Image
              src={'/images/projects/cleaning/implementation.jpg'}
              alt="Implementation"
              fill
              sizes="426px"
              className="object-cover rounded-secondary"
            />
          </div>
          <div>
            <h3 className="font-title text-[#E3E4E6] mb-6">The development phase involved:</h3>
            <ImplementationCleaningList />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default ImplementationCleaningSection;
