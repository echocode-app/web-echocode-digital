import AboutSectionCleaning from '@/components/sections/portfolio/project/AboutSection/AboutSectionCleaning';
import ChallengesSection from '@/components/sections/portfolio/project/ChallengesSection';
import { ImplementationCleaningSection } from '@/components/sections/portfolio/project/ImplementationSection';

import challenges from '@/data/portfolio/projects/challenges/cleaning.json';

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
    </>
  );
};

export default Cleaning;
