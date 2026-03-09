import fullCycle from '@/data/directions/full-cycle.json';
import fullCycleServices from '@/data/directions/full-cycle-services.json';

import SectionContainer from '@/components/UI/section/SectionContainer';
import SectionTitle from '@/components/UI/section/SectionTitle';
import FullCycleList from './FullCycleList';
import CarouselList from '../../components/CarouselList';

const FullCycleSection = () => {
  return (
    <section className="pt-6 pb-10 md:pt-16 md:pb-22">
      <SectionContainer>
        <SectionTitle marginBottom="8px">FULL CYCLE DEVELOPMENT</SectionTitle>
        <div
          className="w-70 sm:w-[320px] mb-10 h-px bg-invert-main-gradient shadow-[6px_0_12px_-4px_rgba(0,0,0,0.75)] 
       mask-[linear-gradient(to_right,black_0%,black_80%,transparent_100%)]"
        />
        <FullCycleList list={fullCycle} />
        <CarouselList list={fullCycleServices} />
      </SectionContainer>
    </section>
  );
};

export default FullCycleSection;
