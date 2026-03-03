import AboutSectionCleaning from '@/components/sections/portfolio/project/AboutSection/AboutSectionCleaning';
import { ImplementationCleaningSection } from '@/components/sections/portfolio/project/ImplementationSection';

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
    </>
  );
};

export default Cleaning;
