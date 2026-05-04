import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import DominationSection from '@/components/sections/directions/igaming/DominationSection';
import FoundationSection from '@/components/sections/directions/igaming/FoundationSection';
import HeroSection from '@/components/sections/directions/igaming/HeroSection';
import SolutionsSection from '@/components/sections/directions/igaming/SolutionsSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import { buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: 'iGaming Development',
    description:
      'iGaming software development focused on scalable infrastructure, traffic systems, ASO and product growth.',
    path: '/service-direction/igaming',
    image: '/images/rabbits/hero/igaming.png',
  });
}

const IGaming = () => {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'iGaming Development', path: '/service-direction/igaming' },
        ]}
      />
      <SectionFirstReveal>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <SolutionsSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <FoundationSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <DominationSection />
      </SectionFirstReveal>
    </>
  );
};

export default IGaming;
