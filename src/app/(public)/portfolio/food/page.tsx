import { AboutSectionFood } from '@/components/sections/portfolio/project/AboutSection';
import ChallengesSection from '@/components/sections/portfolio/project/ChallengesSection';
import { ImplementationSection } from '@/components/sections/portfolio/project/ImplementationSection';
import PlanningSection from '@/components/sections/portfolio/project/PlanningSection/PlanningSection';
import FeaturesSection from '@/components/sections/portfolio/project/FeaturesSection';

import implementations from '@/data/portfolio/projects/implementations/food.json';
import challenges from '@/data/portfolio/projects/challenges/food.json';
import planning from '@/data/portfolio/projects/planning/food.json';
import features from '@/data/portfolio/projects/features/food.json';

const Food = () => {
  return (
    <>
      <section className="pt-42 pb-37.5">
        <h1 className="text-title-3xl md:text-title-5xl lg:text-title-6xl font-title text-center">
          FOOD ＆ DRINK
        </h1>
      </section>
      <AboutSectionFood />
      <ImplementationSection
        list={implementations}
        subtitle="We began with in-depth market research and UI analysis of top-tier fashion apps."
      />
      <ChallengesSection
        list={challenges}
        image="/images/projects/food/challenges.jpg"
        position="0% 50%"
      />
      <PlanningSection
        list={planning}
        image={'/images/projects/food/planning.png'}
        imageStyle="relative w-full max-w-[570px] aspect-570/600"
      />
      <FeaturesSection list={features} />
    </>
  );
};

export default Food;
