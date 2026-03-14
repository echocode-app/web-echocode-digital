import type { Metadata } from 'next';
import EngagementSection from '@/components/sections/partnership/EngagementSection';
import HeroSection from '@/components/sections/partnership/HeroSection';
import SolutionsSection from '@/components/sections/partnership/SolutionsSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Partnership',
    description:
      'Explore partnership models, analytics, attribution and monetization services for product growth with Echocode.',
    path: '/partnership',
    image: '/images/rabbits/hero/partnership.png',
  });
}

const Partnership = () => {
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <EngagementSection />
      <SolutionsSection />
    </>
  );
};

export default Partnership;
