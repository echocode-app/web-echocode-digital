import type { Metadata } from 'next';

import BasedOnCareerSection from '@/components/sections/career/BasedOnCareerSection';
import HeroSection from '@/components/sections/career/HeroSection';
import VacanciesSection from '@/components/sections/career/VacanciesSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Career',
    description:
      'Join Echocode and build high-impact mobile, web and product experiences with a product-focused engineering team.',
    path: '/career',
    image: '/images/rabbits/hero/career.png',
  });
}

const Career = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <BasedOnCareerSection />
      <VacanciesSection />
    </>
  );
};

export default Career;
