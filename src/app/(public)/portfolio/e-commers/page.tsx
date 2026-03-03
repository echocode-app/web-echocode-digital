import { AboutSectionECommerse } from '@/components/sections/portfolio/project/AboutSection';
import ChallengesSection from '@/components/sections/portfolio/project/ChallengesSection';
import { ImplementationSection } from '@/components/sections/portfolio/project/ImplementationSection';

import implementations from '@/data/portfolio/projects/implementations/e-commerce.json';
import challenges from '@/data/portfolio/projects/challenges/e-commerce.json';

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
    </>
  );
};

export default ECommers;
