import { AboutSectionFood } from '@/components/sections/portfolio/project/AboutSection';
import { ImplementationSection } from '@/components/sections/portfolio/project/ImplementationSection';

import implementations from '@/data/portfolio/projects/implementations/food.json';

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
    </>
  );
};

export default Food;
