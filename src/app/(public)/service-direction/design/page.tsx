import ExcellenceSection from '@/components/sections/directions/design/ExcellenceSection';
import HeroSection from '@/components/sections/directions/design/HeroSection';
import MetricsSection from '@/components/sections/directions/design/MetricsSection';
import PhilosophySection from '@/components/sections/directions/design/PhilosophySection';
import SpecializationSection from '@/components/sections/directions/design/SpecializationSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';

const Design = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <PhilosophySection />
      <ExcellenceSection />
      <SpecializationSection />
      <MetricsSection />
    </>
  );
};

export default Design;
