import type { Metadata } from 'next';
import SectionFirstReveal from '@/components/UI/section/SectionFirstReveal';
import FullCycleSection from '@/components/sections/directions/mobile/FullCycleSection';
import HeroSection from '@/components/sections/directions/mobile/HeroSection';
import MarketingSection from '@/components/sections/directions/mobile/MarketingSection';
import SpecializationSection from '@/components/sections/directions/mobile/SpecializationSection';
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
    title: 'Mobile Development',
    description:
      'Native mobile app development for iOS and Android, from product strategy and UX/UI to ASO and growth support.',
    path: '/service-direction/mobile-development',
    image: '/images/rabbits/hero/mobile.png',
  });
}

const Mobile = async ({ params }: PageProps) => {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: 'Home', path: '/' },
          { name: 'Mobile Development', path: '/service-direction/mobile-development' },
        ]}
      />
      <SectionFirstReveal initialVisible>
        <HeroSection />
      </SectionFirstReveal>
      <StaticGradientLine />
      <SectionFirstReveal>
        <FullCycleSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <SpecializationSection />
      </SectionFirstReveal>
      <SectionFirstReveal>
        <MarketingSection />
      </SectionFirstReveal>
    </>
  );
};

export default Mobile;
