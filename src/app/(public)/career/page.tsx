import BasedOnCareerSection from '@/components/sections/career/BasedOnCareerSection';
import HeroSection from '@/components/sections/career/HeroSection';
import VacanciesSection from '@/components/sections/career/VacanciesSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { Suspense } from 'react';

const Career = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <BasedOnCareerSection />
      <Suspense fallback={null}>
        <VacanciesSection />
      </Suspense>
    </>
  );
};

export default Career;
