import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import HeroSection from '@/components/sections/portfolio/HeroSection';
import PortfolioSection from '@/components/sections/portfolio/PortfolioSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { AppLocale, buildPageMetadata } from '@/lib/seo/metadata';

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
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
      <SectionFirstReveal initialVisible>
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
