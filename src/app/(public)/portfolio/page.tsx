import type { Metadata } from 'next';
import HeroSection from '@/components/sections/portfolio/HeroSection';
import PortfolioSection from '@/components/sections/portfolio/PortfolioSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'Portfolio',
    description:
      'Selected product and software development cases by Echocode across mobile, web and digital product delivery.',
    path: '/portfolio',
    image: '/images/rabbits/hero/portfolio.png',
  });
}

interface SearchParamsProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

const Portfolio = async ({ searchParams }: SearchParamsProps) => {
  const projectsFilter = await searchParams;
  return (
    <>
      <HeroSection />
      <StaticGradientLine />
      <PortfolioSection projectsFilter={projectsFilter} />
    </>
  );
};

export default Portfolio;
