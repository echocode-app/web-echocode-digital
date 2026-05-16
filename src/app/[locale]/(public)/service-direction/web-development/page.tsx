import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import HeroSection from '@/components/sections/directions/web/HeroSection';
import StaticGradientLine from '@/components/UI/StaticGradientLine';
import StrategySection from '@/components/sections/directions/web/StrategySection';
import CoreSection from '@/components/sections/directions/web/CoreSection';
import EngineeringSection from '@/components/sections/directions/web/EngineeringSection';
import DevelopmentSection from '@/components/sections/directions/web/DevelopmentSection';
import { AppLocale, buildPageMetadata } from '@/lib/seo/metadata';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

type PageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    locale,
    title: 'Web Development',
    description:
      'Custom web development for scalable products, high-performance platforms and resilient business systems.',
    path: '/service-direction/web-development',
    image: '/images/rabbits/hero/web.png',
  });
}

const WebDevelopment = async ({ params }: PageProps) => {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: 'Home', path: '/' },
          { name: 'Web Development', path: '/service-direction/web-development' },
        ]}
      />
      <SectionFirstReveal initialVisible>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <StrategySection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <CoreSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <EngineeringSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <DevelopmentSection />
      </SectionFirstReveal>
    </>
  );
};

export default WebDevelopment;
