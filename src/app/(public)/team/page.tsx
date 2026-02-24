import HeroSection from '@/components/sections/team/HeroSection';
import PhilosophySection from '@/components/sections/team/PhilosophySection';
import WorkSection from '@/components/sections/team/WorkSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';

const Team = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <PhilosophySection />
      <WorkSection />
    </>
  );
};

export default Team;
