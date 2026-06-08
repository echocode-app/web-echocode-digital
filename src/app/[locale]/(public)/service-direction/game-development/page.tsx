import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import HeroSection from '@/components/sections/directions/game/HeroSection';
import SolutionSection from '@/components/sections/directions/game/SolutionSection';
import UniversesSection from '@/components/sections/directions/game/UniversesSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { AppLocale, buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    title: 'Game Development',
    description:
      'Game development services for immersive digital experiences, gameplay systems and scalable product delivery.',
    path: '/service-direction/game-development',
  });
}

const GameDevelopment = async ({ params }: PageProps) => {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: 'Home', path: '/' },
          { name: 'Game Development', path: '/service-direction/game-development' },
        ]}
      />
      <SectionFirstReveal initialVisible>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <SolutionSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <UniversesSection />
      </SectionFirstReveal>
    </>
  );
};

export default GameDevelopment;
