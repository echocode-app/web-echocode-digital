import HeroSection from '@/components/sections/portfolio/HeroSection';
import PortfolioSection from '@/components/sections/portfolio/PortfolioSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';

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
