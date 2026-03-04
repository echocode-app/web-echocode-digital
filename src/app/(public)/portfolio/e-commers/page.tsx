import { AboutSectionECommerse } from '@/components/sections/portfolio/project/AboutSection';
import { ImplementationSection } from '@/components/sections/portfolio/project/ImplementationSection';
import ChallengesSection from '@/components/sections/portfolio/project/ChallengesSection';
import PlanningSection from '@/components/sections/portfolio/project/PlanningSection';
import FeaturesSection from '@/components/sections/portfolio/project/FeaturesSection/FeaturesSection';

import implementations from '@/data/portfolio/projects/implementations/e-commerce.json';
import challenges from '@/data/portfolio/projects/challenges/e-commerce.json';
import planning from '@/data/portfolio/projects/planning/e-commerce.json';
import features from '@/data/portfolio/projects/features/e-commerce.json';

const ECommers = () => {
  return (
    <>
      <section className="pt-42 pb-37.5">
        <h1 className="text-title-3xl md:text-title-5xl lg:text-title-6xl font-title text-center">
          E-commerce
        </h1>
      </section>
      <AboutSectionECommerse />
      <ImplementationSection
        list={implementations}
        subtitle="We began with in-depth market research and UI analysis of top-tier fashion apps."
      />
      <ChallengesSection
        list={challenges}
        image="/images/projects/e-commers/challenges.jpg"
        position="0% 50%"
      />
      <PlanningSection
        list={planning}
        image={'/images/projects/e-commers/planning.png'}
        imageStyle="relative w-full max-w-157.5 aspect-157.5/139"
      />
      <FeaturesSection list={features} />
    </>
  );
};

export default ECommers;
