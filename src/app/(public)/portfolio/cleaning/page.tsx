import AboutSectionCleaning from '@/components/sections/portfolio/project/AboutSection/AboutSectionCleaning';
import ChallengesSection from '@/components/sections/portfolio/project/ChallengesSection';
import FeaturesCleanning from '@/components/sections/portfolio/project/FeaturesSection/FeaturesCleanning';
import { ImplementationCleaningSection } from '@/components/sections/portfolio/project/ImplementationSection';
import PlanningSection from '@/components/sections/portfolio/project/PlanningSection/PlanningSection';
import ScreensSection from '@/components/sections/portfolio/project/ScreensSection';

import challenges from '@/data/portfolio/projects/challenges/cleaning.json';
import planning from '@/data/portfolio/projects/planning/cleaning.json';

const Cleaning = () => {
  return (
    <>
      <section className="pt-42 pb-37.5">
        <h1 className="text-title-3xl md:text-title-5xl lg:text-title-6xl font-title text-center">
          CLEANING-APP
        </h1>
      </section>
      <AboutSectionCleaning />
      <ImplementationCleaningSection />
      <ChallengesSection
        list={challenges}
        image="/images/projects/cleaning/challenges.png"
        position="50% 50%"
      />
      <PlanningSection
        list={planning}
        image={'/images/projects/cleaning/planning.png'}
        imageStyle="relative w-full max-w-[570px] aspect-570/600"
      />
      <FeaturesCleanning />
      <ScreensSection imagePath="/images/projects/cleaning/screens.png" />
    </>
  );
};

export default Cleaning;
