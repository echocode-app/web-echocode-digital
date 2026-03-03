import { AboutSectionECommerse } from '@/components/sections/portfolio/project/AboutSection';
import { ImplementationSection } from '@/components/sections/portfolio/project/ImplementationSection';

import implementations from '@/data/portfolio/projects/implementations/e-commerce.json';

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
    </>
  );
};

export default ECommers;
