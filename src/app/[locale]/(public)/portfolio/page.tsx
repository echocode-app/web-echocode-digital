import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import HeroSection from '@/components/sections/portfolio/HeroSection';
import PortfolioSection from '@/components/sections/portfolio/PortfolioSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';

type GenerateMetadataProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    title: 'Portfolio',
    description:
      'Selected product and software development cases by Echocode across mobile, web and digital product delivery.',
    path: '/portfolio',
    locale,
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
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <PortfolioSection projectsFilter={projectsFilter} />
      </SectionFirstReveal>
    </>
  );
};

export default Portfolio;
