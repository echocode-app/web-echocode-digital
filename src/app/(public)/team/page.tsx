import HeroSection from '@/components/sections/team/HeroSection';
import PhilosophySection from '@/components/sections/team/PhilosophySection';
import StepsSection from '@/components/sections/team/StepsSection';
import WorkSection from '@/components/sections/team/WorkSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';

const Team = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <PhilosophySection />
      <WorkSection />
      <StepsSection />
    </>
  );
};

export default Team;
